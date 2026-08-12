/**
 * Hair Doctors — ad attribution capture.
 *
 * Deliberately plain, dependency-free JavaScript in a single file: this exact file is
 * what gets handed to whoever maintains telehairdoctors.com.au, and that site's stack
 * is unknown (WordPress, Webflow, raw HTML…). Building it as a framework component
 * would mean the demo proved something different from what ships.
 *
 * Install with one tag, as early in <head> as possible:
 *   <script src="/hd-tracking.js" defer></script>
 *
 * What it does, on every page load:
 *   1. Reads gclid / fbclid / ttclid and the utm_* set from the URL. Ad platforms
 *      append these automatically on a click — nothing needs requesting.
 *   2. Persists them in a first-party cookie on the registrable domain, so they
 *      survive navigation and are readable by the booking subdomain.
 *   3. Decorates links to the booking app so the values cross the domain hop even if
 *      the cookie is unavailable.
 *
 * FIRST TOUCH IS WRITE-ONCE. `first` is only ever set when absent; `last` is
 * overwritten every time. That mirrors the CRM: acquisition is immutable, the
 * converting touch is not. Overwriting `first` would erase the campaign that actually
 * won the customer.
 *
 * Configure before this file loads (all optional):
 *   <script>window.HD_TRACKING = { bookingHosts: ["booking.example.com"], cookieDays: 90 };</script>
 */
(function () {
  "use strict";

  var CONFIG = window.HD_TRACKING || {};
  var COOKIE = CONFIG.cookieName || "hd_attr";
  var DAYS = CONFIG.cookieDays || 90;

  /** Everything worth carrying from an ad click through to a booking. */
  var PARAMS = [
    "gclid",
    "fbclid",
    "ttclid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  /**
   * Second-level TLDs where the registrable domain needs three labels. A cookie set
   * on ".com.au" is rejected by browsers as a public suffix, so `example.com.au` must
   * resolve to `.example.com.au` rather than `.com.au`.
   */
  var MULTI_PART_TLDS = [
    "com.au",
    "net.au",
    "org.au",
    "co.uk",
    "org.uk",
    "co.nz",
    "com.sg",
  ];

  /** The domain a cookie should be set on so subdomains can read it. */
  function registrableDomain(hostname) {
    // An IP or single-label host (localhost) cannot take a dotted cookie domain.
    if (/^[0-9.]+$/.test(hostname)) return null;
    var parts = hostname.split(".");
    if (parts.length < 2) return null;
    var lastTwo = parts.slice(-2).join(".");
    var take = MULTI_PART_TLDS.indexOf(lastTwo) !== -1 ? 3 : 2;
    if (parts.length < take) return null;
    return parts.slice(-take).join(".");
  }

  function readCookie(name) {
    var match = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch (e) {
      return null;
    }
  }

  function writeCookie(name, value) {
    var domain = registrableDomain(location.hostname);
    var parts = [
      name + "=" + encodeURIComponent(JSON.stringify(value)),
      "path=/",
      "max-age=" + DAYS * 24 * 60 * 60,
      "samesite=lax",
    ];
    // Domain-scoped so booking.<domain> can read it. Omitted on localhost, where a
    // dotted domain would make the cookie silently unsettable.
    if (domain) parts.push("domain=." + domain);
    if (location.protocol === "https:") parts.push("secure");
    document.cookie = parts.join("; ");
  }

  /** Attribution params present in the current URL. */
  function fromUrl() {
    var search = location.search;
    if (!search || search.length < 2) return {};
    var out = {};
    var pairs = search.slice(1).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var eq = pairs[i].indexOf("=");
      if (eq < 1) continue;
      var key = decodeURIComponent(pairs[i].slice(0, eq));
      if (PARAMS.indexOf(key) === -1) continue;
      var value = decodeURIComponent(pairs[i].slice(eq + 1).replace(/\+/g, " ")).trim();
      // Cap length: a click id is ~100 chars, and an unbounded value would be a
      // vector for bloating the cookie past what browsers accept (~4KB).
      if (value) out[key] = value.slice(0, 512);
    }
    return out;
  }

  function isEmpty(obj) {
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) return false;
    return true;
  }

  /** Capture this page load into the cookie and return the current state. */
  function capture() {
    var incoming = fromUrl();
    var stored = readCookie(COOKIE) || {};
    if (isEmpty(incoming)) return stored;

    var now = new Date().toISOString();
    // Write-once: the first campaign to bring this visitor keeps the credit.
    if (!stored.first) {
      stored.first = incoming;
      stored.firstAt = now;
    }
    stored.last = incoming;
    stored.lastAt = now;
    writeCookie(COOKIE, stored);
    return stored;
  }

  /**
   * Hosts to decorate links for. Defaults to the `booking.` sibling of this domain,
   * which is the real topology (telehairdoctors.com.au → booking.telehairdoctors.com.au).
   */
  function bookingHosts() {
    if (CONFIG.bookingHosts && CONFIG.bookingHosts.length) return CONFIG.bookingHosts;
    var domain = registrableDomain(location.hostname);
    return domain ? ["booking." + domain] : [];
  }

  /**
   * Append the captured params to booking links.
   *
   * Cookies alone are not enough: they are scoped to one registrable domain, so the
   * moment the booking app lives elsewhere the handoff breaks silently. URL parameters
   * work either way, which also means the demo tests the same mechanism production uses.
   *
   * Uses first-touch values — the booking app records acquisition, and its own funnel
   * events record the conversion.
   */
  function decorateLinks(state) {
    var attribution = state.first;
    if (!attribution || isEmpty(attribution)) return;
    var hosts = bookingHosts();
    if (!hosts.length) return;

    var anchors = document.querySelectorAll("a[href]");
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var url;
      try {
        url = new URL(a.getAttribute("href"), location.href);
      } catch (e) {
        continue;
      }
      if (hosts.indexOf(url.hostname) === -1) continue;
      for (var key in attribution) {
        if (!Object.prototype.hasOwnProperty.call(attribution, key)) continue;
        // Never clobber a value the link already carries — an explicitly tagged link
        // is a deliberate choice by whoever wrote it.
        if (!url.searchParams.has(key)) url.searchParams.set(key, attribution[key]);
      }
      a.setAttribute("href", url.toString());
    }
  }

  /**
   * Append the params at click time, as the authoritative mechanism.
   *
   * Rewriting href attributes up front is not enough on a framework-rendered page: a
   * re-render restores the href React thinks the element should have, silently undoing
   * the decoration. Mutating href inside a capture-phase click handler happens after
   * any re-render and immediately before the browser reads it to navigate, so it cannot
   * be undone — and it also covers links added to the page after load.
   */
  function interceptClicks(getState) {
    document.addEventListener(
      "click",
      function (event) {
        // Let modified clicks through untouched (new tab, download, etc. still read href,
        // which decorateLinks has already best-effort updated).
        var node = event.target;
        while (node && node.nodeName !== "A") node = node.parentNode;
        if (!node || !node.getAttribute) return;

        var href = node.getAttribute("href");
        if (!href) return;

        var attribution = (getState() || {}).first;
        if (!attribution || isEmpty(attribution)) return;

        var hosts = bookingHosts();
        var url;
        try {
          url = new URL(href, location.href);
        } catch (e) {
          return;
        }
        if (hosts.indexOf(url.hostname) === -1) return;

        for (var key in attribution) {
          if (!Object.prototype.hasOwnProperty.call(attribution, key)) continue;
          if (!url.searchParams.has(key)) url.searchParams.set(key, attribution[key]);
        }
        node.setAttribute("href", url.toString());
      },
      true // capture: run before any framework's own click handling
    );
  }

  var state = capture();

  // Best-effort href rewrite so hovering, copying and middle-clicking show the tagged
  // URL. The click interceptor above is what guarantees it on an actual navigation.
  function run() {
    decorateLinks(state);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  interceptClicks(function () {
    return readCookie(COOKIE) || state;
  });

  // Small public surface for debugging and for apps that render links dynamically.
  window.hdTracking = {
    get: function () {
      return readCookie(COOKIE) || {};
    },
    decorateLinks: function () {
      decorateLinks(readCookie(COOKIE) || {});
    },
  };
})();

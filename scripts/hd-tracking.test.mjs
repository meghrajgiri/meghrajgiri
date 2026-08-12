/**
 * Tests for public/hd-tracking.js — run from the project root:
 *   node scripts/hd-tracking.test.mjs
 *
 * The script is plain browser JS handed to a third-party developer, so it is exercised
 * against a minimal DOM/location stub rather than a framework test runner. The cases
 * that matter most are the cookie-domain ones: a cookie set on ".com.au" is rejected
 * by browsers as a public suffix, and the failure is silent — attribution simply never
 * persists on the production domain.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "public/hd-tracking.js"), "utf8");

/** Minimal DOM/location stub — the script touches only these. */
function makeEnv({ hostname, search, protocol = "https:", links = [], cookie = "", tagHosts = null }) {
  const store = { cookie };
  const anchors = links.map((href) => {
    let current = href;
    return {
      getAttribute: () => current,
      setAttribute: (_k, v) => { current = v; },
      get href() { return current; },
    };
  });
  const listeners = {};
  const win = {
    location: { hostname, search, protocol, href: `${protocol}//${hostname}/${search}` },
    document: {
      readyState: "complete",
      addEventListener: (type, fn) => { (listeners[type] ||= []).push(fn); },
      // The script queries for anchors and (when currentScript is unavailable) for its
      // own tag; answer both by selector.
      querySelectorAll: (sel) =>
        String(sel).indexOf("script") === 0
          ? tagHosts === null
            ? []
            : [{ getAttribute: (k) => (k === "data-booking-hosts" ? tagHosts : null) }]
          : anchors,
      currentScript: null,
      get cookie() { return store.cookie; },
      set cookie(v) {
        const [pair] = v.split(";");
        const [k, val] = pair.split("=");
        store.cookie = `${k}=${val}`;
        store.lastWrite = v;
      },
    },
    URL,
    HD_TRACKING: undefined,
  };
  win.window = win;
  return { win, store, anchors, listeners };
}

function run(env, config) {
  if (config) env.win.HD_TRACKING = config;
  const fn = new Function("window", "document", "location", `${src}\nreturn window.hdTracking;`);
  return fn(env.win, env.win.document, env.win.location);
}

let pass = 0, fail = 0;
const ok = (label, cond) => { cond ? pass++ : fail++; console.log(`${cond ? "PASS" : "FAIL"}  ${label}`); };

// --- cookie domain resolution (the production-critical case) ---
for (const [host, expected] of [
  ["hd.meghrajgiri.com", "domain=.meghrajgiri.com"],
  ["meghrajgiri.com", "domain=.meghrajgiri.com"],
  ["telehairdoctors.com.au", "domain=.telehairdoctors.com.au"],
  ["booking.telehairdoctors.com.au", "domain=.telehairdoctors.com.au"],
  ["clinic.co.uk", "domain=.clinic.co.uk"],
]) {
  const env = makeEnv({ hostname: host, search: "?gclid=ABC" });
  run(env);
  ok(`${host} → ${expected}`, (env.store.lastWrite || "").includes(expected));
}

// localhost / IP must not get a dotted domain (cookie would be unsettable)
for (const host of ["localhost", "127.0.0.1"]) {
  const env = makeEnv({ hostname: host, search: "?gclid=ABC", protocol: "http:" });
  run(env);
  ok(`${host} → no domain attribute`, !(env.store.lastWrite || "").includes("domain="));
  ok(`${host} → not marked secure over http`, !(env.store.lastWrite || "").includes("secure"));
}

// --- capture ---
let env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "?gclid=G1&utm_source=google&utm_medium=cpc&utm_campaign=Spring&utm_content=AdGroup1&utm_term=Variant%20A&junk=drop" });
let api = run(env);
let state = api.get();
ok("captures gclid + full utm set", state.first.gclid === "G1" && state.first.utm_campaign === "Spring" && state.first.utm_term === "Variant A");
ok("ignores unknown params", !("junk" in state.first));
ok("records firstAt and lastAt", Boolean(state.firstAt && state.lastAt));

// --- first touch is write-once ---
const firstCookie = env.store.cookie;
env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "?gclid=G2&utm_source=meta", cookie: firstCookie });
api = run(env);
state = api.get();
ok("second visit does NOT overwrite first touch", state.first.gclid === "G1");
ok("second visit DOES update last touch", state.last.gclid === "G2");

// --- no params: existing cookie untouched ---
env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "", cookie: firstCookie });
api = run(env);
ok("untagged visit preserves stored attribution", api.get().first.gclid === "G1");

// --- link decoration ---
env = makeEnv({
  hostname: "hd.meghrajgiri.com",
  search: "?gclid=G9&utm_source=google",
  links: ["https://booking.meghrajgiri.com/signup", "https://booking.meghrajgiri.com/x?gclid=EXPLICIT", "https://example.com/other", "/internal"],
});
run(env);
ok("decorates the booking link", env.anchors[0].href.includes("gclid=G9") && env.anchors[0].href.includes("utm_source=google"));
ok("does not clobber an explicit value", env.anchors[1].href.includes("gclid=EXPLICIT"));
ok("leaves unrelated hosts alone", env.anchors[2].href === "https://example.com/other");
ok("leaves relative links alone", env.anchors[3].href === "/internal");

// --- configured booking hosts ---
env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "?gclid=G7", links: ["https://booking.telehairdoctors.com.au/signup"] });
run(env, { bookingHosts: ["booking.telehairdoctors.com.au"] });
ok("honours configured bookingHosts", env.anchors[0].href.includes("gclid=G7"));

// --- oversized value is capped ---
env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "?gclid=" + "x".repeat(2000) });
api = run(env);
ok("caps an oversized click id at 512 chars", api.get().first.gclid.length === 512);

// --- click interception: the mechanism that survives a framework re-render ---
env = makeEnv({
  hostname: "hd.meghrajgiri.com",
  search: "?gclid=G_CLICK&utm_source=google",
  links: ["https://booking.meghrajgiri.com/signup"],
});
run(env);
const anchor = env.anchors[0];
// Simulate React restoring the original href after hydration.
anchor.setAttribute("href", "https://booking.meghrajgiri.com/signup");
ok("href reset by a re-render loses the decoration", !anchor.href.includes("gclid"));
// Now click it: the capture-phase handler must re-apply before navigation.
const clickHandler = env.listeners.click?.[0];
ok("a capture-phase click listener was registered", typeof clickHandler === "function");
clickHandler({ target: { nodeName: "A", getAttribute: anchor.getAttribute, parentNode: null, setAttribute: anchor.setAttribute } });
ok("click re-applies attribution despite the reset", anchor.href.includes("gclid=G_CLICK"));

// A click on a non-booking link must be left alone.
env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "?gclid=G1", links: ["https://example.com/x"] });
run(env);
const other = env.anchors[0];
env.listeners.click[0]({ target: { nodeName: "A", getAttribute: other.getAttribute, parentNode: null, setAttribute: other.setAttribute } });
ok("click on an unrelated host is untouched", other.href === "https://example.com/x");

// A click on a nested element inside the anchor must still resolve to the anchor.
env = makeEnv({ hostname: "hd.meghrajgiri.com", search: "?gclid=G_NEST", links: ["https://booking.meghrajgiri.com/signup"] });
run(env);
const nested = env.anchors[0];
env.listeners.click[0]({
  target: { nodeName: "SPAN", parentNode: { nodeName: "A", getAttribute: nested.getAttribute, setAttribute: nested.setAttribute, parentNode: null } },
});
ok("click on a child element still decorates the anchor", nested.href.includes("gclid=G_NEST"));

// --- configuration from the script tag (how the demo points at localhost) ---
env = makeEnv({
  hostname: "hd.meghrajgiri.com",
  search: "?gclid=G_TAG&utm_source=google",
  links: ["http://localhost:3000/signup"],
  tagHosts: "localhost",
});
run(env);
ok("data-booking-hosts decorates a localhost CTA", env.anchors[0].href.includes("gclid=G_TAG"));

// Without the attribute the same link is skipped — the bug this fixes.
env = makeEnv({
  hostname: "hd.meghrajgiri.com",
  search: "?gclid=G_NONE",
  links: ["http://localhost:3000/signup"],
});
run(env);
ok("without the attribute a localhost CTA is skipped", !env.anchors[0].href.includes("gclid"));

// A full URL in the attribute is accepted, not just a bare host.
env = makeEnv({
  hostname: "hd.meghrajgiri.com",
  search: "?gclid=G_URL",
  links: ["http://localhost:3000/signup"],
  tagHosts: "http://localhost:3000/signup",
});
run(env);
ok("data-booking-hosts accepts a full URL", env.anchors[0].href.includes("gclid=G_URL"));

// Multiple hosts, comma separated.
env = makeEnv({
  hostname: "hd.meghrajgiri.com",
  search: "?gclid=G_MULTI",
  links: ["https://booking.telehairdoctors.com.au/signup"],
  tagHosts: "localhost, booking.telehairdoctors.com.au",
});
run(env);
ok("data-booking-hosts accepts a comma-separated list", env.anchors[0].href.includes("gclid=G_MULTI"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

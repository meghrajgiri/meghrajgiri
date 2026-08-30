# Brief — eRx Script Exchange integration for telehealth prescribing

| Field | Value |
|---|---|
| **URL** | `/blog/erx-script-exchange-integration` |
| **Role** | spoke · National infrastructure integration |
| **Primary keyword** | `erx script exchange integration` |
| **Secondary keywords** | — |
| **Template** | how-to |
| **Word count target** | 1,700 |
| **Priority score** | 65/100 — relative, not search volume |
| **Incoming internal links** | 2 |

---

> ### Clearance required before writing
>
> **Whether eRx or another script exchange was integrated, and the token/dispense flow as built.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 58 chars

```
eRx Script Exchange Integration for Telehealth Prescribing
```

**Meta description** — 130 chars

```
How electronic prescribing works in an Australian telehealth product — the exchange, the token, and what the pharmacy end expects.
```

---

## Outline

## Why you integrate an exchange rather than build prescribing
_300 words_

eRx has been the Prescription Exchange Service since 2009 and was contracted for the National Prescription Delivery Service in 2023. This is infrastructure, not a feature.

## The token flow end to end
_500 words_

Practitioner prescribes, the script goes to the exchange, the patient receives a token by SMS or email, any participating pharmacy dispenses. Model each step as state.

## The Active Script List
_350 words_

What it changes for repeat prescriptions and for the patient experience, and what it means for your data model.

## Becoming a software partner
_400 words_

What eRx requires of an integrating system, and the conformance path. Contrast with going through an existing platform such as MediRecords or Halaxy.

## Build versus integrate versus resell
_400 words_

Standalone platforms like RxPad exist. Sometimes the right answer for a client is not to build this at all — saying so is what earns trust.

## Failure modes worth designing for
_350 words_

Token delivery failure, pharmacy not participating, cancellation and re-issue.

---

## Key points

- The end-to-end state diagram is the artifact. Draw it.
- The build-versus-integrate section is unusually persuasive commercially: telling a prospect not to build something is the strongest possible credibility signal.
- Link to the prescription-modelling post — that is where the data model detail belongs, not here.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- `erx.com.au` — five of the top ten results are eRx's own pages. Vendor documentation, naturally framed to sell the service.
- `medirecords.com/e-prescribing/` and `telstrahealth.com` — product pages.
- `health.gov.au/our-work/electronic-prescribing` — policy, not implementation.
- There is no independent implementer's account anywhere in this SERP.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [Integrating My Health Record via the FHIR Gateway: a real walkthrough](/blog/my-health-record-fhir-gateway-integration) | `My Health Record integration` | sibling |
| [Modelling prescriptions as orders: Medusa v2 workflows for a telehealth clinic](/blog/medusa-v2-telehealth-clinic-workflows) | `prescriptions in a clinic workflow` | cross-cluster |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> In an Australian telehealth product you do not build prescribing, you integrate an exchange: the clinician prescribes, the script goes to eRx, and the patient receives a token by SMS or email that any participating pharmacy can dispense against. The engineering work is state management around that token, not the prescription itself.

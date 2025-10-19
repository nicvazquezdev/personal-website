---
title: "system requirements & architectural drivers"
date: "19-10-2025"
excerpt: "every system starts with a simple question: what are we building — and why? this post explores how requirements, quality attributes, and constraints shape software architecture, and how navigating that ambiguity is the real craft behind system design."
---

_recommended reading first: [introduction to software architecture](https://www.nicolasvazquez.com.ar/thoughts/introduction-to-software-architecture)_

when we talk about system design, we’re no longer thinking about small pieces of code — we’re thinking about entire ecosystems.
systems with moving parts, users, and expectations that are sometimes clear, sometimes not at all.

## understanding system requirements

requirements are just formal descriptions of what we need to build.
but as we move from small tasks to large systems, the scope becomes wider, the abstraction higher, and the path less defined.

when we’re asked to implement a method or a class, we usually know what the input and output look like.
but when we’re asked to design a whole system — a file storage platform, a video streaming service, a ride sharing app — the possibilities explode.
so do the questions.

system design is ambiguous by nature.
and that ambiguity comes from two places:

- the person giving the requirements often isn’t an engineer
- and getting the right requirements is part of solving the problem

the client usually doesn’t know what they need — they only know what _problem_ they want solved.

### the hitchhiking service example

say we’re asked to build something that “allows people to join drivers on a route, who are willing to take passengers for a fee.”

it sounds simple, but quickly turns into questions:

- is it real-time or advance reservation?
- is it mobile-only? desktop too?
- who processes the payments?

these questions aren’t just details — they _shape the architecture itself._

## why getting requirements right matters

at first glance, it might seem like software is easy to change.
there’s no physical material, so why not just fix things later?

but at scale, that’s a dangerous illusion.

large systems involve hundreds of engineers, months of work, contracts, infrastructure, and reputations.
one wrong assumption can cost more than we think — not just in money, but in trust.

## types of requirements

we can think of them in three layers:

1. **functional requirements** — what the system must do
2. **non-functional requirements (quality attributes)** — how the system must be
3. **constraints** — the boundaries we can’t cross

### functional requirements

these describe behavior — the _features_ of the system.
they’re what users see and interact with, but they rarely dictate the architecture itself.

examples:

- “when a rider logs into the mobile app, show a map with nearby drivers within a 5-mile radius.”
- “after a ride completes, charge the rider’s card and credit the driver, minus fees.”

these are inputs, outputs, and flows — but not yet design.

## gathering feature requirements

the naive way is to just ask the client to describe everything they need.
for large-scale systems, that rarely works.

a better approach:

- **use cases** → the real situations where the system is used
- **user flows** → how each use case unfolds step by step

the process usually looks like this:

1. identify all actors or users
2. capture and describe every possible use case
3. expand each one into a flow of events — each event includes _action_ and _data_

back to our hitchhiking service:
actors → rider and driver
use cases → registration, login, ride success, ride failure

this can be visualized with **sequence diagrams**, part of uml — though in practice, few follow uml strictly.
still, it’s a great way to visualize interactions between users and systems.

## system quality attributes

most systems aren’t redesigned because of missing features — but because they fail at the invisible things:

- not fast enough
- doesn’t scale
- too hard to maintain
- too fragile
- too insecure

quality attributes are non-functional requirements. they define how well our system performs on specific dimensions, directly shaping its architecture.

examples:

- “when a user searches, results must appear within 100ms” → performance
- “the store must be available 99.9% of the time” → availability
- “deploy a new version at least twice a week” → deployability

these are measurable, testable, and concrete.
if we can’t measure them, we can’t know if we’ve met them.

but there’s always a catch — trade-offs.
you can’t have everything.
performance and security might fight each other, as can flexibility and simplicity.
part of good architecture is knowing which qualities to prioritize.

## constraints and their influence

once we know what the system must do, we can decide _how_ to do it — but not everything is in our control.

a **system constraint** is a decision already made for us, limiting our degrees of freedom.
it can sound negative, but it’s not always bad.

constraints can serve as **pillars** — solid starting points that the rest of the system can be built around.

### types of constraints

- **technical constraints**
  forced hardware or cloud vendor, required tech stack, database, platform, or browser support.
  these influence our architecture more than they seem.
  example: running on-premise eliminates many cloud-native patterns.

- **business constraints**
  budgets, deadlines, or third-party integrations.
  architecture looks very different when you have six months instead of two years.

- **regulatory constraints**
  laws and compliance standards:

  - hipaa (us) for healthcare data
  - gdpr (eu) for user privacy

these are often non-negotiable and must be embedded in the design from day one.

### learning to accept and question constraints

some constraints are external — real, fixed, unchangeable.
others are internal — chosen out of habit or convenience.

good architects question the latter.
being “locked” to a vendor or language might just be a self-imposed limitation.

and when we do have real restrictions, we should design for flexibility:
keep components loosely coupled so they can be swapped later with minimal effort.

## closing thoughts

system design isn’t just about building software — it’s about navigating ambiguity.
it’s part psychology, part logic, and part creativity.

requirements tell us what to build.
quality attributes tell us how good it must be.
constraints tell us what we can’t change.

architecture is born at the intersection of those three.

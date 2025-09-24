---
title: "building a guestbook for my personal website"
date: "24-09-2025"
excerpt: "notes from a late-night idea: let visitors leave a signature on my site, without overbuilding the stack. trade-offs, mistakes, and the path to a simple guestbook."
---

## tuesday night, 11:36pm

i’m sitting here, late at night, immersed in my personal site. i enjoy making it different from the rest, but without overloading it with flashy features. tonight i had some free time, so i started experimenting.

that’s when the idea came up: a **signature wall**. a place where visitors could leave their mark.

the thing is… my site has no backend. sure, i have a blog, but posts are just `.md` files that i render statically. nothing dynamic, no databases. i’m not planning to scale this project too far, so for now i’ll lean on **supabase** to store the signatures.

## limiting to one signature per user

first question: how do i limit a person to just one signature?

my first idea was simple: save a flag in localstorage, something like `localStorage.setItem("signed", true)`. but that’s too easy to bypass — anyone could just clear storage and sign again.

second idea: generate a random session id (uuid), store it in a cookie, and also in supabase when the user signs. as long as the cookie exists, they can’t sign again. more robust, but still not bulletproof — deleting cookies would reset the system.

third idea: do it per user with a proper backend and login. discarded immediately. i don’t want to add authentication or force people to log in just to leave a signature.

for now, i’m going with idea two.

## filtering inappropriate content

second challenge: how do i stop people from leaving obscenities?

first thought: a simple blacklist — an array of banned words in english and spanish.

then i considered regex. regex would let me block variants like `s.h.i.t`.

another option: external moderation apis like google perspective, cleanspeak, webpurify, even openai’s moderation api.

for now, i’ll go with regex.

i’ll also limit signatures to 20–30 characters, and maybe add little hints to encourage people to leave their actual names. to make it more personal, i’ll generate the date automatically, so everyone can see when a signature was left.

## freeform vs structured

i started thinking about how to actually display the signatures.

option 1: freeform placement. the user clicks anywhere on the wall, and their signature shows up there.

**pros**: unique, creative, every visit feels organic, could become a strong differentiator for the site.

**cons**: lots of extra work for responsive. i’d probably need a canvas or fullscreen div, validate coordinates, prevent overlaps, handle viewport resizing, even hide the header when in that section.

option 2: structured list or grid. signatures appear next to each other, and on mobile, one below the other.

**pros**: much easier to implement and maintain. clean design, integrates well with the site’s aesthetic, responsive comes almost for free.

**cons**: less magical, less unique.

for the mvp i’ll start with option 2. maybe later i’ll try the more creative version.

## future maintenance

some questions for later:

- what happens if the wall fills up? pagination with lazy loading makes sense — show the most recent first.
- what if someone regrets their signature? editing or deleting could be allowed.
- what do i really want this section to convey? not just a random canvas, but something closer to a **guestbook**. a record that someone “was here.” so the name changes: from signature wall → **guestbook**.

## first coding session

time to code. i opened supabase, but my session had expired. for some reason, login wasn’t loading, neither register nor login. occupational hazards…

it was 12:24am. i thought about sleeping and continuing another day when supabase was working fine, but instead i kept vibe-coding for a while.

i built the mvp without supabase for now:

- components: `GuestbookForm`, `GuestbookEntry`, `GuestbookList`, `GuestbookStatus`
- all inside `components/Guestbook/` for structure
- in dev mode: works with localstorage only
- ready for prod: once supabase is configured, it’ll switch automatically

problems i faced:

- keeping consistent styling with the rest of the site
- edit button: form wasn’t updating on `editingEntry` change → fixed with a `useEffect`
- visual glitch: form flickered on load → solved with an initial loading state

by 1:02am, it was functional locally. i went to bed.

## next day, 1:04pm

supabase was working again, i could log in.

but i hit a new problem: where do i find the supabase url and keys?

apparently supabase had updated their dashboard. before, there were `anon` and `service_role` keys. now:

- under **legacy api keys**, they still show anon and service_role for compatibility
- under **api keys (new)**, they show `publishable key` (replaces anon in new projects) and `secret keys` (replace service_role).

so my `supabase_anon_key` is now the **publishable key**.

finding the supabase url was trickier. turns out you need to grab it from the browser’s address bar in the dashboard:
`https://<project-ref>.supabase.co`

at first my code didn’t work — there was a typo in my .env url. fixed it, but then i got a 406 error. maybe rls?

turns out the bug was my query. i had used `.single()`, which expects exactly one result. when there are none, supabase throws a 406 instead of returning an empty array. removing `.single()` fixed it. i also added detailed logs to see what was happening.

then i realized i had disabled rls while debugging. re-enabled it, and everything worked. crud with supabase was functional.

## improving the blacklist

next issue: my regex was too aggressive. i couldn’t even submit “hello world.” so i tried a smarter regex, but soon decided to simplify with `.includes()`.

### what worked well

- catches banned words even when they’re concatenated (e.g. `shitbro`)
- faster and less error-prone than my regex attempt
- blocks instantly, great for short strings

### weaknesses

- unicode variants pass (`fúck`, `mïerda`)
- hidden separators (`f.u.c.k`, `p🦆ta`) also pass

solution: normalize text (`normalize("NFD")` to strip accents), and clean up spaces or symbols before checking.

i implemented a multi-layer blacklist:

1. length check (max 30 chars)
2. normalize text (remove accents, invisible characters)
3. check direct `.includes()`
4. check common separator patterns (`f.u.c.k`, `fu ck`)
5. maintain a banned words array of 50+ terms

if the message fails validation, the user sees:
`why would you send inappropriate content?`

examples:

- `fuck` → blocked
- `fuckyou` → blocked
- `f.u.c.k` → blocked
- `fúck` → blocked
- `hello world` → allowed

## dev vs prod

i realized dev mode shouldn’t rely on memory anymore. instead, i duplicated the `guestbook` table in supabase and named it `guestbook_dev`.

now:

- dev mode writes to `guestbook_dev`
- prod writes to `guestbook`
- same codebase, no branching logic
- cleaner, persistent, easier to debug

advantages:

- dev entries don’t pollute prod
- debugging is transparent in the dashboard
- easy to reset dev table anytime

## final state

with the blacklist polished and supabase wired up, the guestbook is live.

the system is robust enough, simple to maintain, and consistent with the rest of my site’s design.

i also implemented a few tiny tweaks, like removing the character limit so people can write more freely.

it works.

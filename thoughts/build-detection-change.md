---
title: "keeping dashboards up to date: build detection challenge"
date: "23-09-2025"
excerpt: "a real-world note on detecting outdated dashboards: the problem, the options i considered, and the final flow using an auto-generated version\_info.json with git\_sha."
---

some dashboards were lagging behind and didn’t have the latest changes after a deploy. the goal: detect the latest build, compare it with the currently loaded bundle from the browser, and trigger a force refresh on the page.

the plan was to modify the python (flask) backend to provide an endpoint exposing the current build number, so the frontend could request it and compare.

## initial context

we were already showing a build number in the ui by reading `version.json`, but that file was being **updated manually** on each pull request.

i first imagined a simple endpoint like:

```json
{
  "build": "1.0.0"
}
```

## research: how to wire the check

i looked into three options:

- **web workers**: run the check in another thread so the ui doesn’t block. it would work, but it’s unnecessary here; the data is super simple.
- **polling**: ask the server every few minutes, like a hungry kid asking every 5 minutes if the pizza is here. it’s inefficient if the api returns large data (not our case).
- **websockets**: what we “need” for real-time, but could be overengineering for this. however, i noticed websockets are already integrated in the app, so here it could be more useful and cost less effort.

for now i decided to create the backend endpoint, still reading the build number from the `version.json` we update manually.

## the first backend attempt

i wrote a small api to return the build version (reading `frontend/version.json`). this is what i had:

```python
import json
import os
from flask import Response
from flask_appbuilder.api import expose, safe

from base_api import BaseApi


class BuildRestApi(BaseApi):
    """An API to get build version information"""

    resource_name = "build"
    openapi_spec_tag = "Build"

    @expose("/", methods=("GET",))
    @safe
    def get_build(self) -> Response:
        """Get the build version information
        ---
        get:
          description: >-
            Returns the build version information.
          responses:
            200:
              description: The build version
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        type: object
                        properties:
                          build:
                            type: string
                            example: "1.43.67"
        """
        try:
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            version_file_path = os.path.join(current_dir, "frontend", "version.json")

            with open(version_file_path, 'r') as f:
                version_data = json.load(f)
                build_version = version_data.get("version", None)

            return self.response(200, result={"build": build_version})
        except (FileNotFoundError, json.JSONDecodeError, KeyError):
            return self.response(200, result={"build": None})
```

after a bit, i realized it didn’t make much sense: i was still depending on a **manually updated** file. the logical step would be to get the build number from **bamboo** (our ci/cd), so that number is generated automatically.

## the key question for the frontend

if the backend exposes the current `bamboo.buildNumber` in real time (e.g. `456`), the frontend could still be serving a **previous bundle** (e.g. `452`). so the question became: how does the **frontend** detect it’s on an old build?

my idea:

1. the frontend stores its own build at runtime. during the app build (webpack), inject the current build number into `process.env.BUILD_NUMBER` or into a `version.json` packaged with the bundle.
2. the frontend calls the backend to get the current build number (e.g. `456`).
3. if `frontendBuild !== backendBuild`, we’re running an old bundle → show a notice or force refresh.

## a possible detour (devops)

i spoke with devops. the easiest path might be a **cloud function** with access to the **artifact registry api** (which has the build info from bamboo). that function would expose an api returning the build number. this could take a **few days**. if they expose that api (last bamboo build that produced the latest image), i wouldn’t need any backend change.

## the breakthrough: `version_info.json`

then i discovered a file that’s **generated on every build**:

`version_info.json`

```json
{ "GIT_SHA": "123", "version": "x.x" }
```

that `GIT_SHA` is ideal to detect outdated dashboards. every bamboo build/deploy changes it. it’s unique for each commit/deploy and not easy to “fake”.

this means we **don’t need to depend on bamboo** directly. the automatically generated `version_info.json` is enough to detect whether a user is on an old build.

## final flow

**backend**

- endpoint: `/api/build`
- behavior: reads `/static/version_info.json` and returns:
  ```json
  {
    "git_sha": "7016a...",
    "version": "1.0.0",
    "timestamp": "2025-09-23T10:30:00Z"
  }
  ```
- source of truth: `/static/version_info.json` is generated automatically during the build and updated on every commit/deploy.

**frontend**

- custom hook: `useVersionChecker`
- role: monitors version changes
- mechanism: **polling** every 5 minutes
- persistence: uses **localstorage** to remember the current version between sessions
- comparison: compares the current `git_sha` from the backend with the stored one
- ui: shows a notification when there’s a new version and lets the user **force refresh**

**force refresh actions**

- clear localstorage (remove stored version)
- unregister service workers (if any)
- clear browser cache
- force reload

**integration**

- added at the **root** of the project so it’s available on every page.

## advantages

**backend**

- simple: just one endpoint reading an existing json
- automatic: updates with each deploy
- cache busting: the timestamp helps avoid browser caching issues

**frontend**

- polling in background + discreet notification
- persistent: remembers the version between sessions
- error handling + fallback
- fully clears cache

**user experience**

- no manual steps required
- informative: clearly shows there’s a new version
- optional: user can dismiss or refresh

## result

we got it. the `version_info.json` + `git_sha` approach gives us a clean, automatic way to detect outdated dashboards and refresh them safely—without depending on manual updates or waiting on a new api.

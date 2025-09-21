---
title: "virtual environments: what, why, how"
date: "21-09-2025"
excerpt: "a simple guide to understanding why virtual environments exist, how they work, and how to use them to keep your python projects clean and isolated."
---

when you start with python, one of the first concepts that shows up is the _virtual environment_. but what exactly is it, and why do we need it?

## what happens when you install python

installing python creates a folder on your system that contains:

- the python executable
- the standard library
- supporting files and binaries

when you run `python`, it’s just calling that executable inside the folder.

## the problem

imagine two different projects:

- project a needs `psycopg` version 2
- project b needs `psycopg` version 3

libraries get installed directly into the python folder. you can’t have two versions of the same library coexisting there, because the file names overlap.

## the manual solution

you could:

- copy the entire python folder
- install version 2 in one copy, version 3 in the other
- run each project using its own copy

it works, but it’s messy and impractical.

## virtual environments

a **virtual environment** is essentially an isolated copy of python with its own libraries, created automatically for you.

- on mac and linux it uses symlinks (no full duplication)
- on windows it makes a physical copy

each project gets its own sandboxed environment, so dependencies never conflict.

## under the hood

when you create a virtual environment, a few key things happen:

- a new folder is created with its own `bin/` (or `Scripts/` on windows), `lib/`, and `site-packages/` directories
- a small config file called `pyvenv.cfg` is placed inside, pointing back to the “real” python installation
- the `python` and `pip` binaries inside `bin/` are either copies or symlinks that know to use this environment

when you “activate” the environment, the script simply updates your shell:

- `PATH` is changed so that the venv’s `bin/` comes first, meaning `python` and `pip` now point to the virtual environment
- `VIRTUAL_ENV` is set so tools know which environment is active

inside python itself, you can see this by checking:

```python
import sys
print(sys.prefix) # points to your virtual environment
print(sys.base_prefix) # points to your global python installation
```

this is how python knows whether it’s running inside a virtual environment or not.

## isolation details

the isolation is partial but effective:

- the standard library is shared from your system installation
- the third-party libraries live only in the environment’s `site-packages`

so you can always `import math` or `import os`, but when you install `flask` or `numpy`, they’re stored only in that environment.

## how to use them

python includes a built-in tool: `venv`.

```python
# create a virtual environment

python3 -m venv venv

# activate it

source venv/bin/activate # mac / linux
venv\Scripts\activate # windows

# install what you need

pip install requests
```

once activated, `python` will point to the binary inside your environment and only see the libraries you installed there.

## other tools

- **virtualenv**: older, with some extra options
- **pipenv**: combines virtual environments with dependency management using a pipfile
- **venv**: simple, comes with python by default

## the golden rule

never install libraries in your global python.  
create a virtual environment for every project.

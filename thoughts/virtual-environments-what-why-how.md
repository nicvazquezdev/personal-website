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

a _virtual environment_ is essentially an isolated copy of python with its own libraries, created automatically for you.

- on mac and linux it uses symlinks (no full duplication)
- on windows it makes a physical copy

each project gets its own sandboxed environment, so dependencies never conflict.

## how to use them

python includes a built-in tool: `venv`.

```bash
# create a virtual environment
python3 -m venv venv

# activate it
source venv/bin/activate   # mac / linux
venv\Scripts\activate      # windows

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

---
title: "building a programming language in spanish"
date: "25-09-2025"
excerpt: "notes on designing a small spanish-first language: why, what exists already, tech choices, a first interpreter, and the path toward a clean, modular architecture"
---

it started with a simple thought: in latin america, many people don’t have resources. many don’t speak english, and often don’t have the chance to learn it. programming can be a way forward, but english raises the barrier. what if there was a language that spoke their language? that’s how [hispano-lang](https://github.com/nicvazquezdev/hispano-lang) began — an open-source experiment, 100% free, created as a bridge for beginners.

i asked first: do spanish languages already exist? yes — several:

- **latino**: fully in spanish, meant for beginners without the language barrier
- **gargar**: used in argentinian high schools, pseudocode style, spanish keywords (`si`, `sino`, `repetir`, `mostrar`)
- **español leng**: same spirit, with commands like `escribir`, `leer`
- **linces** (lenguaje de computación en español): for spanish-speaking students, basic structures in spanish

even with prior art, it could still be fun to build one — open source, 100% free.

## what i’d build with, and whether i know enough

to build “a language”, i’d actually build a **compiler** or an **interpreter** (translate to another language or execute directly). with ai around, the learning curve is softer — i won’t reinvent everything.

possible **host languages** (the implementation language):

- c / c++ (classics; gcc/clang land)
- java (lots of educational compilers)
- python (great for quick prototypes and experimental langs)
- rust / go (modern, memory/concurrency benefits)

**lexing/parsing tools:**

- lex / yacc (traditional, c)
- flex / bison (modernized)
- antlr (popular; targets java, c#, python, javascript)
- peg.js (parser in javascript)

**llvm** if i wanted native and fast: emit optimized ir, then real assembly for multiple architectures.

**virtual machines**: i could write a small vm like python’s bytecode or target an existing vm (jvm, .net clr).

my strongest immediate candidates:

- **python**: i’m not aiming for a production-grade language right now; this is to help people learn. i already know python.
- **rust**: modern and fast; lots of companies moving there. caveat: i’ve never written a line of rust.

do i know enough? yes — especially for an educational mini-language, and with ai to assist. i’ll research as i go.

## the knowledge i actually need (and what i don’t)

for a serious production language you’d want: compiler theory, formal languages and automata, grammars, lexing, parsing, semantic analysis, code generation, optimization, systems/architecture (memory, cpu, registers, syscalls), language design (imperative, functional, oo, declarative; minimal vs verbose vs domain-specific).

for my **mini-language** (educational) i can simplify a lot:

1. a bit of compiler theory: understand lexer, parser, interpreter
2. basic lexing/parsing: convert code into tokens (`si`, `mientras`, `mostrar`), recognize simple patterns via regex or a light parser
3. a small interpreter: execute the ast directly; e.g., `mostrar "hola"` becomes a node and calls `console.log("hola")`
4. language design in spanish: define keywords (`si`, `sino`, `repetir`, `mostrar`), pick syntax
5. optional light semantics: simple checks (variables exist before use; basic type sanity)

**key differences**: production needs optimization and machine code; an educational mini-language only needs to analyze and execute basic instructions. it could even transpile to javascript or python behind the scenes.

## how people will use it (distribution)

i don’t want heavy installers or platform-specific friction. the plan:

- publish the language on **npm** so anyone can install and run it locally
- build a **web playground** so learners can try it instantly without installing anything

two paths, same language: npm for local use; the playground for immediate experiments.

## interpreter first: the simplest possible thing (javascript)

start minimal. one instruction: `mostrar "texto"`.

```
function interpret(code) {
  const lines = code.split("\n").map(line => line.trim()).filter(line => line)

  for (const line of lines) {
    if (line.startsWith("mostrar")) {
      const match = line.match(/"(.*)"/)
      if (match) {
        console.log(match[1])
      }
    }
  }
}

// Example usage
interpret(`
mostrar "hola mundo"
mostrar "aprendiendo programación"
`)
```

the interpreter receives the code as a string, splits lines, ignores empties, if a line starts with `mostrar` it looks for text in quotes and prints it.

**expected output:**

```
hola mundo
aprendiendo programación
```

now extend it with variables (`variable x = 10`, `mostrar x`):

requirements:

- `mostrar "texto"` → print a string
- `variable x = valor` → define numeric or string variables
- `mostrar x` → print the variable’s value

```
function interpret(code) {
  const lines = code.split("\n").map(line => line.trim()).filter(line => line)
  const variables = {}

  for (const line of lines) {
    if (line.startsWith("variable")) {
      const match = line.match(/^variable\s+(\w+)\s*=\s*(.+)$/)
      if (match) {
        let [, name, value] = match
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        } else if (!isNaN(Number(value))) {
          value = Number(value)
        }
        variables[name] = value
      }
    } else if (line.startsWith("mostrar")) {
      const matchString = line.match(/"(.*)"/)
      const matchVar = line.match(/^mostrar\s+(\w+)$/)
      if (matchString) {
        console.log(matchString[1])
      } else if (matchVar) {
        const varName = matchVar[1]
        if (variables.hasOwnProperty(varName)) {
          console.log(variables[varName])
        } else {
          console.error(`Variable "${varName}" is not defined`)
        }
      }
    }
  }
}

// Example usage
interpret(`
variable x = 10
variable saludo = "hola mundo"
mostrar x
mostrar saludo
mostrar "aprendiendo fundamentos"
`)
```

**expected output:**

```
10
hola mundo
aprendiendo fundamentos
```

how it works, step by step:

1. the interpreter receives the full text
2. it splits into lines, trims, and filters empties
3. if a line starts with `variable`, it stores `name = value` in a `variables` dictionary (numbers parsed with `Number`, strings stripped of quotes)
4. if a line starts with `mostrar`, it either prints a quoted string or looks up a variable and prints its value
5. net effect: a tiny engine that understands two spanish instructions (`variable`, `mostrar`) and translates them into javascript operations (store in a map and `console.log`)

example of preprocessing:

```
"variable x = 10\nmostrar x\n"
→ ["variable x = 10", "mostrar x"]
```

## from quick hack to something i can grow

this “if-ladder + regex” works, but will become unreadable and hard to extend. i want it professional, scalable, and easy to read. time to move to a classic three-layer architecture.

**architecture (three layers):**

```
source code (spanish)
  ↓
tokenizer     → converts text to tokens
  ↓
parser        → converts tokens to ast
  ↓
evaluator     → executes the ast
```

**directory structure:**

```
javascript-interpret/
├── main.js                 # entry point
├── package.json
├── README.md               # docs in spanish
├── README.en.md            # docs in english
├── src/
│   ├── tokenizer.js        # lexical analysis
│   ├── parser.js           # syntax analysis
│   ├── evaluator.js        # evaluation/execution
│   └── interpreter.js      # coordinator
└── test/
    └── test.js             # automated tests
```

**components:**

**1. tokenizer (src/tokenizer.js)**

function: lexical analysis — recognizes keywords, numbers, strings, symbols

input: `"variable edad = 25"`

output: `[ {type: "VARIABLE"}, {type: "IDENTIFIER", lexeme: "edad"}, ... ]`

**2. parser (src/parser.js)**

function: syntax analysis — builds the ast

input: token list

output: ast (abstract syntax tree)

**3. evaluator (src/evaluator.js)**

function: evaluation — executes the program

input: ast

output: program results

**4. interpreter (src/interpreter.js)**

function: orchestration — runs tokenizer → parser → evaluator

input: full source code

output: final result

**execution flow example** (`"variable edad = 25"`):

```
// 1. TOKENIZER
"variable edad = 25" →
[
  {type: "VARIABLE", lexeme: "variable"},
  {type: "IDENTIFIER", lexeme: "edad"},
  {type: "EQUAL", lexeme: "="},
  {type: "NUMBER", lexeme: "25", literal: 25}
]

// 2. PARSER
Tokens →
{
  type: "VariableDeclaration",
  name: "edad",
  initializer: {type: "Literal", value: 25}
}

// 3. EVALUATOR
AST → executes: environment.define("edad", 25)

// 4. RESULT
Variables: { edad: 25 }
```

**design principles**

- modularity: each component has a single responsibility
- simplicity: start with two commands (`variable`, `mostrar`) and minimal syntax
- extensibility: structure ready to add features later
- testability: unit test each module
- readability: clear separation of concerns
- educational value: a good mental model for how interpreters work

**advantages of this architecture**

- scalable: easy to add tokens, operators, statements
- maintainable: each file has a focused purpose
- testable: tokenize/parse/evaluate independently
- readable: code stays organized
- educational: the structure mirrors compiler theory

**tokenizer, conceptually**

```
scanToken() {
  const char = this.advance();
  switch (char) {
    case '=': this.addToken("EQUAL"); break;
    case '"': this.string(); break;
    default:
      if (this.isDigit(char)) this.number();
      else if (this.isAlpha(char)) this.identifier();
  }
}
```

**parser, conceptually**

```
variableDeclaration() {
  const name = this.consume("IDENTIFIER", "Expected variable name");
  let initializer = null;
  if (this.match("EQUAL")) {
    initializer = this.expression();
  }
  return { type: "VariableDeclaration", name: name.lexeme, initializer };
}
```

**evaluator, conceptually**

```
execute(statement) {
  switch (statement.type) {
    case "VariableDeclaration":
      this.executeVariableDeclaration(statement);
      break;
    case "MostrarStatement":
      this.executeMostrarStatement(statement);
      break;
  }
}

executeVariableDeclaration(statement) {
  let value = null;
  if (statement.initializer !== null) {
    value = this.evaluateExpression(statement.initializer);
  }
  this.environment.define(statement.name, value);
}
```

**interpreter orchestration, conceptually**

```
interpret(source) {
  try {
    const tokens = this.tokenizer.tokenize(source);
    const parser = new Parser(tokens);
    const statements = parser.parse();
    const output = this.evaluator.evaluate(statements);
    return { success: true, output, error: null };
  } catch (error) {
    return { success: false, output: [], error: error.message };
  }
}
```

## adding control flow: `si` / `sino` (`if` / `else`)

next, i add conditionals to make the language actually branch.

**new keywords**

- `si`, `sino`, `verdadero`, `falso`

**comparison operators**

- `>`, `>=`, `<`, `<=`, `==`, `!=`

**arithmetic operators**

- `+`, `-`, `*`, `/`, and unary `-`
- `+` concatenates strings too

**block syntax**

- `{` and `}` delimit blocks

**tokenizer additions (concept)**

```
const keywords = {
  si: "SI",
  sino: "SINO",
  verdadero: "TRUE",
  falso: "FALSE"
}

// operators, braces, etc.
// case ">": this.addToken("GREATER"); break;
// case "==": this.addToken("EQUAL_EQUAL"); break;
// case "{": this.addToken("LEFT_BRACE"); break;
```

**parser additions (concept)**

```
// parse if
ifStatement() {
  const condition = this.expression();
  this.consume("LEFT_BRACE", "Expected { after condition");
  const thenBranch = this.block();
  this.consume("RIGHT_BRACE", "Expected } after block");

  let elseBranch = null;
  if (this.match("SINO")) {
    // parse else branch
  }

  return { type: "IfStatement", condition, thenBranch, elseBranch };
}
```

**evaluator additions (concept)**

```
// conditions
executeIfStatement(statement) {
  if (this.isTruthy(this.evaluateExpression(statement.condition))) {
    this.executeBlock(statement.thenBranch);
  } else if (statement.elseBranch !== null) {
    this.executeBlock(statement.elseBranch);
  }
}

isTruthy(value) {
  if (value === null) return false;
  if (typeof value === "boolean") return value;
  return true;
}

// comparisons
evaluateBinaryExpression(left, operator, right) {
  switch (operator) {
    case "GREATER": return left > right;
    case "EQUAL_EQUAL": return left === right;
    case "GREATER_EQUAL": return left >= right;
    // ... other operators
  }
}
```

**resulting syntax**

```
// simple conditional
variable edad = 18
si edad >= 18 {
    mostrar "mayor de edad"
}

// with else
variable edad = 16
si edad >= 18 {
    mostrar "mayor de edad"
} sino {
    mostrar "menor de edad"
}
```

**architecture stays the same**: tokenizer → parser → evaluator; the ast now includes `IfStatement`.
**result**: the language makes decisions and reacts to conditions — much more useful for actual learning.

## where this leaves me

this is an educational, spanish-first language: minimal, approachable, open source. it will be installable via **npm** and usable instantly in a **web playground**. i started with the tiniest interpreter, then moved to a modular architecture i can extend. from `mostrar` and `variable` to `si`/`sino`, the path is clear.

i’ll keep adding features over time, but the idea is already there: a small language that lowers the barrier for beginners who can’t rely on english, and a codebase that’s clean enough to learn from as it grows.

repo: [hispano-lang](https://github.com/nicvazquezdev/hispano-lang)

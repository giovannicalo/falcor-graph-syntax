# Falcor Graph Syntax
[![Build Status](https://travis-ci.org/giovannicalo/falcor-graph-syntax.svg?branch=master)](https://travis-ci.org/giovannicalo/falcor-graph-syntax)
[![Coverage Status](https://coveralls.io/repos/giovannicalo/falcor-graph-syntax/badge.svg?branch=master&service=github)](https://coveralls.io/github/giovannicalo/falcor-graph-syntax?branch=master)
[![bitHound Score](https://www.bithound.io/github/giovannicalo/falcor-graph-syntax/badges/score.svg)](https://www.bithound.io/github/giovannicalo/falcor-graph-syntax)

Simplified [GraphQL](https://github.com/facebook/graphql) query syntax for [Falcor](https://github.com/Netflix/falcor).

Falcor path syntax can get very long and redundant:

```
[
	["foo", 1, "foo", ["foo", "bar"]],
	["foo", 1, "bar", 0, "foo"],
	["bar", 0, "foo", { from: 0, to: 9 }, ["foo", "bar"]],
	["bar", 0, "bar", { length: 10 }]
]
```

The deeper you go in the model, the worse it gets.

This library lets you use an alternative syntax, similar to that of GraphQL:

```
`
	foo(id: 1) {
		foo { foo, bar },
		bar(index: 0) { foo }
	},
	bar(index: 0) {
		foo(from: 0, to: 9) { foo, bar },
		bar(length: 10)
	}
`
```

## Installation

```
npm install falcor-graph-syntax
```

## Usage

Import the library.

```
import FalcorGraphSyntax from "falcor-graph-syntax";
```

Then replace your `paths` (strings or arrays)...

```
model.get(paths).subscribe(...);
```

... with your `query` (string), wrapped in the `FalcorQuerySyntax()` function.

```
model.get(FalcorQuerySyntax(query)).subscribe(...);
```

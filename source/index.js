import Pegjs from "pegjs";

import Grammar from "./grammar.js";

const Parser = Pegjs.buildParser(Grammar);

class Compiler {

	static compile(graph) {
		return Compiler.merge(Compiler.flattenAll(Compiler.traverse(Parser.parse(graph))));
	}

	static flatten(path) {
		let flattened = [];
		for (const element of path) {
			if (Array.isArray(element)) {
				flattened = flattened.concat(Compiler.flatten(element));
			} else {
				flattened.push(element);
			}
		}
		return flattened;
	}

	static flattenAll(paths) {
		return paths.map((path) => {
			return Compiler.flatten(path);
		});
	}

	static merge(paths) {
		const merged = [];
		for (const path of paths) {
			const atom = path.pop();
			let index = -1;
			for (const checkPath in merged) {
				if (JSON.stringify(path) === JSON.stringify(merged[checkPath].slice(0, -1))) {
					index = checkPath;
					break;
				}
			}
			if (index >= 0) {
				merged[index][merged[index].length - 1].push(atom);
			} else {
				path.push([
					atom
				]);
				merged.push(path);
			}
		}
		for (const path of merged) {
			if (path[path.length - 1].length === 1) {
				path[path.length - 1] = path[path.length - 1][0];
			}
		}
		return merged;
	}

	static traverse(items) {
		const paths = [];
		for (const item of items) {
			const path = [];
			path.push(item.identifier);
			if (item.filters) {
				if (item.filters[0].key === "id" || item.filters[0].key === "index") {
					path.push(item.filters[0].value | 0);
				} else {
					path.push(item.filters.reduce((filters, filter) => {
						filters[filter.key] = filter.value | 0;
						return filters;
					}, {}));
				}
			}
			if (item.children) {
				const childrenPaths = Compiler.traverse(item.children);
				for (const childPath of childrenPaths) {
					const fullPath = [].concat(path);
					fullPath.push(childPath);
					paths.push(fullPath);
				}
			} else {
				paths.push(path);
			}
		}
		return paths;
	}

}

export default Compiler.compile;

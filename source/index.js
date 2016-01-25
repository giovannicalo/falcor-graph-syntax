import Pegjs from "pegjs";

import Grammar from "./grammar.js";

const Parser = Pegjs.buildParser(Grammar);

const flatten = (path) => {
	let flattened = [];
	(path || []).forEach((element) => {
		if (element && element.id) {
			flattened.push(element.id);
		} else if (Array.isArray(element)) {
			flattened = flattened.concat(flatten(element));
		} else {
			flattened.push(element);
		}
	});
	return flattened;
};

const flattenAll = (paths) => {
	return paths.map((path) => {
		return flatten(path);
	});
};

const merge = (paths) => {
	const merged = [];
	(paths || []).forEach((path) => {
		const atom = path.pop();
		let index = -1;
		merged.forEach((value, key) => {
			if (JSON.stringify(path) === JSON.stringify(merged[key].slice(0, -1))) {
				index = key;
			}
		});
		if (index >= 0) {
			const target = merged[index][merged[index].length - 1];
			if (!~target.indexOf(atom)) {
				target.push(atom);
			}
		} else {
			path.push([atom]);
			merged.push(path);
		}
	});
	merged.forEach((path) => {
		if (path[path.length - 1].length === 1) {
			path[path.length - 1] = path[path.length - 1][0];
		} else {
			path[path.length - 1] = path[path.length - 1].sort();
		}
	});
	return merged;
};

const traverse = (items) => {
	const paths = [];
	(items || []).forEach((item) => {
		const path = [];
		path.push(item.identifier);
		if (item.filters) {
			if (item.filters[0].key === "id" || item.filters[0].key === "index") {
				if (Array.isArray(item.filters[0].value)) {
					path.push({
						id: item.filters[0].value.map((value) => {
							return value | 0;
						})
					});
				} else {
					path.push(item.filters[0].value | 0);
				}
			} else {
				path.push(item.filters.reduce((filters, filter) => {
					filters[filter.key] = filter.value | 0;
					return filters;
				}, {}));
			}
		}
		if (item.children) {
			traverse(item.children).forEach((childPath) => {
				const fullPath = path.slice();
				fullPath.push(childPath);
				paths.push(fullPath);
			});
		} else {
			paths.push(path);
		}
	});
	return paths;
};

export default (graph) => {
	return merge(flattenAll(traverse(Parser.parse(graph))));
};

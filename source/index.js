import Pegjs from "pegjs";

import Grammar from "./grammar";

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
		const atom = path.slice(-1)[0];
		const chain = path.slice(0, -1);
		let index = -1;
		merged.forEach((value, key) => {
			if (JSON.stringify(chain) === JSON.stringify(merged[key].slice(0, -1))) {
				index = key;
			}
		});
		if (index >= 0) {
			const target = merged[index][merged[index].length - 1];
			if (!~target.indexOf(atom)) {
				target.push(atom);
			}
		} else {
			chain.push([atom]);
			merged.push(chain);
		}
	});
	return merged.map((path) => {
		const merged = path.slice();
		const lastKey = path.length - 1;
		const lastValue = path[lastKey];
		if (lastValue.length === 1) {
			merged[lastKey] = lastValue[0];
		} else {
			merged[lastKey] = lastValue.sort();
		}
		return merged;
	});
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
					return {
						...filters,
						[filter.key]: filter.value | 0
					};
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

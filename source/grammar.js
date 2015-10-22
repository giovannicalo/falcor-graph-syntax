export default `
	start =
		whitespace
		items: item*
		whitespace
		{
			return items;
		}

	item "item" =
		whitespace
		identifier: identifier
		filters: filters?
		whitespace
		children: (
			whitespace
			[{]
			whitespace
			item*
			whitespace
			[}]
			whitespace
			[,]?
			whitespace
		)?
		whitespace
		[,]?
		whitespace
		{
			return {
				children: children ? children[3] : null,
				filters: filters,
				identifier: identifier
			};
		}

	identifier "identifier" =
		whitespace
		identifier: [a-zA-Z0-9_]+
		whitespace
		{
			return identifier.join("");
		}

	filters "filters" =
		whitespace
		[(]
		whitespace
		filters: filter*
		whitespace
		[)]
		whitespace
		{
			return filters;
		}

	filter "filter" =
		whitespace
		key: identifier
		whitespace
		[:]
		whitespace
		value: identifier
		whitespace
		[,]?
		whitespace
		{
			return {
				key: key,
				value: value
			};
		}

	whitespace "whitespace" =
		whitespace: [\\ \\n\\r\\t]*
		{
			return whitespace.join("");
		}
`;

/* global describe, it */

import Chai from "chai";

import FalcorGraphSyntax from "../source";

const expect = Chai.expect;

Chai.config.showDiff = true;

describe("Falcor", () => {
	describe("Graph Syntax to Path Syntax Conversion", () => {
		it("should convert an empty string", () => {
			expect(FalcorGraphSyntax("")).to.deep.equal([]);
		});
		it("should convert a root element", () => {
			expect(FalcorGraphSyntax("foo")).to.deep.equal([["foo"]]);
		});
		it("should convert a root element with an index", () => {
			expect(FalcorGraphSyntax("foo(id: 1)")).to.deep.equal([["foo", 1]]);
		});
		it("should convert a root element with an index and properties", () => {
			expect(FalcorGraphSyntax("foo(id: 1) { bar, foo }")).to.deep.equal([["foo", 1, ["bar", "foo"]]]);
		});
		it("should convert several root elements with indices, properties, filters and children", () => {
			expect(FalcorGraphSyntax(`
				foo(id: [1, 2, 3]) {
					foo { foo, bar },
					bar(index: 0) { foo }
				},
				bar(index: 0) {
					foo(from: 0, to: 9) { bar, foo },
					bar(length: 10)
				}
			`)).to.deep.equal([
				["foo", [1, 2, 3], "foo", ["bar", "foo"]],
				["foo", [1, 2, 3], "bar", 0, "foo"],
				["bar", 0, "foo", { from: 0, to: 9 }, ["bar", "foo"]],
				["bar", 0, "bar", { length: 10 }]
			]);
		});
		it("should convert duplicate root elements and properties, extending them and never repeating them", () => {
			expect(FalcorGraphSyntax(`
				foo(id: 1) { foo { bar, foo } },
				foo(id: 1) { foo { foo } }
			`)).to.deep.equal([["foo", 1, "foo", ["bar", "foo"]]]);
		});
	});
});

const { describe, it } = require("mocha");
const { assert } = require("chai");

describe("test index", () => {
  const index = require("./test");

  it("index is function", () => {
    assert.isFunction(index);
  });

  it("index call", () => {
    assert.isTrue(index(), "fail");
  });
});

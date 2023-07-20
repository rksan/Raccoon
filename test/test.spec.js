const { describe, it } = require("mocha");
const { assert } = require("chai");

describe("test index", () => {
  const index = () => {};

  it("index is function", () => {
    assert.isFunction(index);
  });
});

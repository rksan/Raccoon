//import { test } from "jest";
import { func } from "./test";

test("test index", () => {
  const index = require("./test");

  it("index call", () => {
    expect(func()).toBe(true);
  });
});

import { findPrevNextObjs } from "../src/util";

const children = [
  {
    key: 1
  },
  {
    key: 2
  },
  {
    key: 3
  },
  {
    key: 4
  },
  {
    key: 5
  }
];

describe("findPrevNextList", () => {
  it("should make correct list", () => {
    expect(findPrevNextObjs(2, children)).toEqual([[1], [3, 4, 5]]);
    expect(findPrevNextObjs(1, children)).toEqual([[], [2, 3, 4, 5]]);
  });
});

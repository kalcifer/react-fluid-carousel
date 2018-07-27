import Carousel from "../src";
import React from "react";
import { render, cleanup } from "react-testing-library";

describe("Test the component", () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 40,
        height: 40,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      };
    });
  });
  afterEach(cleanup);
  test("Empty carousel", () => {
    expect(render(<Carousel />).container).toMatchSnapshot();
  });
  test("With some children", () => {
    const component = (
      <Carousel>
        <div key="1" style={{ width: "40px", height: "40px" }} />
        <div key="2" style={{ width: "40px", height: "40px" }} />
      </Carousel>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

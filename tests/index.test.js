import Carousel from "../src";
import React from "react";
import { render, cleanup } from "react-testing-library";

describe("Test the component", () => {
  afterEach(cleanup);
  test("Empty carousel", () => {
    expect(render(<Carousel />)).toMatchSnapshot();
  });
  test("With some children", () => {
    expect(
      render(
        <Carousel>
          <div style={{ width: "40px", height: "40px" }} />
          <div style={{ width: "40px", height: "40px" }} />
        </Carousel>
      )
    ).toMatchSnapshot();
  });
});

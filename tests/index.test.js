import Carousel from "../src";
import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";

describe("Test the component", () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 40,
        height: 20,
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
        <div key="1" style={{ width: "40px", height: "20px" }} />
        <div key="2" style={{ width: "40px", height: "20px" }} />
      </Carousel>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
  test("On prev/next click", () => {
    const component = (
      <Carousel>
        <div key="1" style={{ width: "40px", height: "20px" }} />
        <div key="2" style={{ width: "40px", height: "20px" }} />
      </Carousel>
    );
    const { container } = render(component);
    const buttons = container.querySelectorAll("button");
    const [prev, next] = buttons;
    fireEvent(
      next,
      new MouseEvent("click", {
        bubbles: true, // click events must bubble for React to see it
        cancelable: true
      })
    );
    expect(container.firstChild.children[1].style.transform).toEqual(
      "translateX(-50px)"
    );
    fireEvent(
      next,
      new MouseEvent("click", {
        bubbles: true, // click events must bubble for React to see it
        cancelable: true
      })
    );
    expect(container.firstChild.children[1].style.transform).toEqual(
      "translateX(-100px)"
    );
    fireEvent(
      prev,
      new MouseEvent("click", {
        bubbles: true, // click events must bubble for React to see it
        cancelable: true
      })
    );
    expect(container.firstChild.children[1].style.transform).toEqual(
      "translateX(-50px)"
    );
  });
});

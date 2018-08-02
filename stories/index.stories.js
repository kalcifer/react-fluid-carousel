import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Carousel from "../src";

storiesOf("Carousel", module)
  .add("with 30 items", () => {
    const arr = new Array(30).fill(1);

    return (
      <Carousel>
        {arr.map((val, key) => {
          return (
            <div
              key={key}
              style={{
                width: "60px",
                height: "80px",
                border: "1px solid",
                background: `#${Math.floor(Math.random() * 16777215).toString(
                  16
                )}` // thanks paul irish!https://www.paulirish.com/2009/random-hex-color-code-snippets/
              }}
            />
          );
        })}
      </Carousel>
    );
  })
  .add("with 5 items", () => {
    const arr = new Array(5).fill(1);

    return (
      <Carousel>
        {arr.map((val, key) => {
          return (
            <div
              key={key}
              style={{
                width: "60px",
                height: "80px",
                border: "1px solid",
                background: `#${Math.floor(Math.random() * 16777215).toString(
                  16
                )}` // thanks paul irish!https://www.paulirish.com/2009/random-hex-color-code-snippets/
              }}
            />
          );
        })}
      </Carousel>
    );
  });

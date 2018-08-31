import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Carousel from "../src";

const buildCarousel = (arr, props) => {
  return (
    <Carousel {...props}>
      {arr.map((val, key) => {
        return (
          <div
            key={JSON.stringify(key)}
            style={{
              width: "60px",
              height: "80px",
              border: "1px solid",
              background: `#${Math.floor(Math.random() * 16777215).toString(
                16
              )}` // thanks paul irish!https://www.paulirish.com/2009/random-hex-color-code-snippets/
            }}
          >
            {key}
          </div>
        );
      })}
    </Carousel>
  );
};

storiesOf("Carousel", module)
  .add("with 30 items", () => {
    const arr = new Array(30).fill(1);
    return buildCarousel(arr);
  })
  .add("with 5 items", () => {
    const arr = new Array(5).fill(1);

    return buildCarousel(arr);
  })
  .add("Moving 5 slides at a time", () => {
    const arr = new Array(30).fill(1);
    return buildCarousel(arr, { slidesToScroll: 5, speed: 1000 });
  })
  .add("Speed of 500 ms", () => {
    const arr = new Array(30).fill(1);
    return buildCarousel(arr, { speed: 500 });
  })
  .add("Speed of 1000 ms", () => {
    const arr = new Array(30).fill(1);
    return buildCarousel(arr, { speed: 1000 });
  })
  .add("Diff width", () => {
    const arr = new Array(30).fill(1);
    return (
      <Carousel slidesToScroll={3}>
        {arr.map((val, key) => {
          return (
            <div
              key={JSON.stringify(key)}
              style={{
                width: "200px",
                height: "140px",
                border: "1px solid",
                background: `#${Math.floor(Math.random() * 16777215).toString(
                  16
                )}` // thanks paul irish!https://www.paulirish.com/2009/random-hex-color-code-snippets/
              }}
            >
              {key}
            </div>
          );
        })}
      </Carousel>
    );
  });

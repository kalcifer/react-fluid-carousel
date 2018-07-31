import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Carousel from "../src";

storiesOf("Carousel", module).add("with text", () => {
  const arr = new Array(30).fill(1);

  return (
    <Carousel>
      {arr.map((val, key) => {
        return (
          <div
            key={key}
            style={{ width: "60px", height: "80px", border: "1px solid" }}
          />
        );
      })}
    </Carousel>
  );
});

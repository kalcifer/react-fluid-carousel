import React from "react";
import { carouselObjStyle } from "./const";

export default class ItemRenderer extends React.PureComponent {
  render() {
    const { data, index: key, style } = this.props;
    const { child, childStyles, childRef, onMouseEnter, onMouseLeave } = data[
      key
    ];
    return (
      <div
        style={{
          ...childStyles,
          ...carouselObjStyle,
          ...style,
          ...{ padding: "10px" }
        }}
        ref={childRef}
        data-key={key}
        onMouseEnter={() => onMouseEnter(key)}
        onMouseLeave={() => onMouseLeave(key)}
      >
        {child}
      </div>
    );
  }
}

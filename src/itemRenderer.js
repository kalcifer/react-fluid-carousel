import React from "react";

export default class ItemRenderer extends React.PureComponent {
  render() {
    const { data, index: key, style } = this.props;
    const {
      child,
      childStyles,
      childRef,
      onMouseEnter,
      onMouseLeave,
      diffHeight,
      diffWidth
    } = data[key];
    const itemStyle = {
      top: `${diffHeight / 2}px`,
      left: `${style.left + diffWidth / 2}px`
    };
    return (
      <div
        style={{
          ...childStyles,
          ...style,
          ...itemStyle
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

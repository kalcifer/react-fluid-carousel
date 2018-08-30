import React from "react";
import Carousel from "./view";

const prevNextStyle = {
  zIndex: "10"
};

const noHoverStyle = {
  opacity: "0.8",
  outline: "none",
  cursor: "pointer"
};

const PrevButton = ({ disabled, onClick, basicStyle }) => {
  let style = disabled ? {} : noHoverStyle;
  style = { ...style, ...prevNextStyle };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...style }}>
      Prev
    </button>
  );
};

const NextButton = ({ disabled, onClick, basicStyle }) => {
  let style = disabled ? {} : noHoverStyle;
  style = { ...style, ...prevNextStyle };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...style }}>
      Next
    </button>
  );
};

const ProgressUnit = ({ enabled }) => {
  const normalStyle = {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "gray"
  };
  const enabledStyle = {
    background: "red"
  };
  const style = enabled ? { ...normalStyle, ...enabledStyle } : normalStyle;
  return <div style={style} />;
};

export default ({
  children,
  renderPrev,
  renderNext,
  renderProgress,
  ...props
}) => (
  <Carousel
    renderPrev={renderPrev || PrevButton}
    renderNext={renderNext || NextButton}
    renderProgress={renderProgress || ProgressUnit}
    {...props}
  >
    {children}
  </Carousel>
);

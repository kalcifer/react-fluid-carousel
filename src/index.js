import React from "react";
import Carousel from "./view";

const prevNextStyle = {
  position: "absolute",
  marginTop: "20px",
  zIndex: "10",
  content: "<",
  width: "40px",
  background: "black",
  border: "black",
  opacity: "0.5"
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
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...basicStyle, ...style }}
    />
  );
};

const NextButton = ({ disabled, onClick, basicStyle }) => {
  let style = disabled ? {} : noHoverStyle;
  style = { ...style, ...prevNextStyle };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...basicStyle, ...style }}
    />
  );
};

const ProgressUnit = ({ enabled }) => {
  const normalStyle = {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "gray"
  };
  const enabledStyle = {
    background: "white"
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

import {
  childAfterHoverVals,
  childBeforeHoverVals,
  childHoverVals
} from "./const";

export const getChildStyles = (hoveredItem, key) => {
  let childStyles = {};
  if (hoveredItem) {
    if (key == hoveredItem) {
      childStyles = childHoverVals;
    }
    if (key < hoveredItem) {
      childStyles = childBeforeHoverVals;
    }
    if (key > hoveredItem) {
      childStyles = childAfterHoverVals;
    }
  }
  childStyles = {
    ...childStyles,
    transition: "transform 500ms",
    cursor: "pointer"
  };

  return childStyles;
};

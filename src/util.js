import {
  childAfterHoverVals,
  childBeforeHoverVals,
  childHoverVals
} from "./const";

export const getChildStyles = (hoveredItem, key, scaleX, scaleY, diffWidth) => {
  let childStyles = {};
  if (hoveredItem >= 0) {
    if (key == hoveredItem) {
      childStyles = childHoverVals(scaleX, scaleY);
    }
    if (key < hoveredItem) {
      childStyles = childBeforeHoverVals(diffWidth / 2);
    }
    if (key > hoveredItem) {
      childStyles = childAfterHoverVals(diffWidth / 2);
    }
  }
  childStyles = {
    ...childStyles,
    transition: "transform 500ms",
    cursor: "pointer"
  };

  return childStyles;
};

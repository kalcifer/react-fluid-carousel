export const childHoverVals = scale => ({
  transform: `scaleX(${scale}) scaleY(1.1)`
});

export let childBeforeHoverVals = diff => ({
  transform: `translateX(-${diff}px)`
});
export let childAfterHoverVals = diff => ({
  transform: `translateX(${diff}px)`
});

export const containerStyle = {
  overflowX: "hidden",
  position: "relative"
};

export const carouselStyle = {
  display: "flex",
  padding: "20px 0"
};

export const inline = {
  display: "inline",
  border: "none"
};

export const padding = 10;

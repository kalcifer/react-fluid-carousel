## react-fluid-carousel

`react-fluid-carousel` is a react based carousel component. It is built on top of the functionality that [react-window]() offers.

### Why another carousel?

### How to use?

Here is a demo of it working as storybooks.

[Demo](https://nostalgic-snyder-f61435.netlify.com/)

#### Usage details

Let's say you have a set of images that you want to show in a carousel.
It looks like

```js
const imgArray = [
  { id: img1, url: "http://img1" },
  { id: img2, url: "http://img2" },
  { id: img3, url: "http://img3" },
  { id: img4, url: "http://img4" },
  { id: img5, url: "http://img5" }
];
```

Your carousel component would be constructed as

```js
import React from "react";
import Carousel from "react-fluid-carousel";

export default ({ imgArray }) => {
  return (
    <Carousel>
      {imgArray.map(img => (
        <div key={img.id}>
          <img src={img.url} alt="description" />
        </div>
      ))}
    </Carousel>
  );
};
```

This will look at the width of the Carousel's parent, and calculate how many images can be fit in a window of the carousel. It will then divide the items into pages and provides prev and next buttons. It will show a netflix like focus animation by default on hover over a carousel item.

#### Customising the carousel

`speed` [int in ms] default = 0 - Speed of movement - When you click on the prev/next button, this says how long the animation should last.
`slidesToScroll` [int] default = pageSize - This will scroll the carousel by this number regardless of page size.
`scale` [int] default = 1.2 - This will control the size of the animation on focus.

`renderPrev`/ `renderNext` - These are render prop based methods which you can use to send customised components for prev/next interactions.
It will receive an object as props with the following - `{ disabled, onClick, basicStyle }`
`disabled` [boolean] - Will send true if there is a prev page to scroll to, or if the carousel is in mid-animation.
`onClick` [function] - This has to be called by the custom component for prev/next functionality to work.
`basicStyle` [object] - This is a styles object with values for `height` of the carousel, `top` margin of the carousel items

`renderProgress` - This is another render prop based method which you can use to send customised progressunit. It will receive an object with the prop `enabled`, which can help you define the highlighted style of the progress unit. Click on this jumps to the respective page and is handled by the carousel by default.

You can check all these usage cases in `stories/index.stories.js`

import React from "react";
import AnimatedList from "./animated-list";
import ItemRenderer from "./itemRenderer";
import NodeResolver from "react-node-resolver";
import { padding, addTop, inline } from "./const";
import { getChildStyles } from "./util";
class Carousel extends React.Component {
  static defaultProps = {
    slidesToScroll: null,
    speed: 10,
    scale: 1.2
  };

  reactChildren = [];
  element = null;
  pages = null;
  pageItems = 0;
  count = null;
  lastPage = null;
  constructor(props) {
    super(props);
    this.reactChildren = React.Children.toArray(props.children);
    this.count = React.Children.count(props.children);
    if (props.slidesToScroll) {
      this.pageItems = props.slidesToScroll;
    }
  }
  state = {
    currentPage: 1,
    height: null,
    width: null,
    parentWidth: null,
    fullWidth: null,
    top: null,
    hoveredItem: null,
    scaledHeight: null,
    scaledWidth: null
  };
  componentDidMount() {
    if (this.element) {
      const dimensions = this.element.getBoundingClientRect();
      const parentDimensions = this.element.parentElement.getBoundingClientRect();

      const parentWidth = parentDimensions.width;
      const scaledWidth = dimensions.width * this.props.scale;
      const fullWidth = scaledWidth * this.count;
      this.lastPage = Math.floor(parentWidth / scaledWidth);
      if (!this.pageItems)
        this.pageItems = Math.abs((this.count - this.lastPage) / 2);
      if (fullWidth > parentWidth) {
        this.showCarousel = true;
        this.pages = Math.ceil(
          (this.count - this.lastPage) / this.pageItems + 1
        );
      }
      this.setState({
        height: dimensions.height,
        width: dimensions.width,
        scaledHeight: dimensions.height * this.props.scale,
        scaledWidth,
        top: dimensions.top + addTop,
        parentWidth,
        fullWidth
      });
    }
  }
  getRef = element => {
    this.element = element;
  };
  onMouseEnter = key => {
    this.setState({
      hoveredItem: key
    });
  };
  onMouseLeave = key => {
    this.setState({
      hoveredItem: null
    });
  };
  progress = pageNo => {
    this.setState({
      currentPage: pageNo
    });
  };
  prev = () => {
    this.setState(({ currentPage }) => {
      if (1 < currentPage <= this.pages) {
        return { currentPage: currentPage - 1 };
      } else return { currentPage };
    });
  };
  next = () => {
    this.setState(({ currentPage }) => {
      if (1 <= currentPage < this.pages) {
        return { currentPage: currentPage + 1 };
      } else return { currentPage };
    });
  };
  render() {
    const {
      onMouseEnter,
      onMouseLeave,
      props,
      state,
      reactChildren,
      getRef,
      prev,
      next,
      pages,
      pageItems,
      showCarousel,
      count
    } = this;
    const { children, renderPrev, renderNext, renderProgress, speed } = props;
    const {
      height,
      scaledHeight,
      scaledWidth,
      parentWidth,
      hoveredItem,
      position,
      currentPage,
      top
    } = state;

    if (!children || count < 0) {
      return <div>Gimme some children</div>;
    }
    if (!height) {
      const firstChild = reactChildren[0];
      return <NodeResolver innerRef={getRef}>{firstChild}</NodeResolver>;
    }
    const itemData = reactChildren.map((child, key) => {
      const childStyles = getChildStyles(hoveredItem, key);
      return { child, childStyles, key, onMouseEnter, onMouseLeave };
    });
    const prevButtonDisabled = currentPage === 1 || hoveredItem;
    const nextButtonDisabled = currentPage === pages || hoveredItem;
    const pageArray = new Array(pages).fill(1);
    return (
      <React.Fragment>
        {showCarousel &&
          pageArray.map((item, pageNo) => {
            const isEnabled = pageNo === currentPage - 1;
            return (
              <span
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  marginRight: "5px"
                }}
                onClick={() => this.progress(pageNo + 1)}
              >
                {renderProgress({ enabled: isEnabled })}
              </span>
            );
          })}
        {showCarousel && (
          <button style={inline}>
            {renderPrev({
              disabled: prevButtonDisabled,
              onClick: prev,
              basicStyle: { height, top: `${top}px` }
            })}
          </button>
        )}
        <AnimatedList
          itemData={itemData}
          height={scaledHeight}
          itemSize={scaledWidth}
          direction="horizontal"
          itemCount={count}
          width={parentWidth}
          style={{ overflow: "hidden" }}
          scrollToItem={(currentPage - 1) * pageItems}
          duration={speed}
        >
          {ItemRenderer}
        </AnimatedList>
        {showCarousel && (
          <button style={inline}>
            {renderNext({
              disabled: nextButtonDisabled,
              onClick: next,
              basicStyle: { height, right: 0, top: `${top}px` }
            })}
          </button>
        )}
      </React.Fragment>
    );
  }
}

export default Carousel;

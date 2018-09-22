import React from "react";
import AnimatedList from "./animated-list";
import ItemRenderer from "./itemRenderer";
import NodeResolver from "react-node-resolver";
import { padding, inline } from "./const";
import { getChildStyles } from "./util";
class Carousel extends React.Component {
  static defaultProps = {
    slidesToScroll: null,
    speed: 10,
    scaleX: 1.2,
    scaleY: 1.1
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
    hoveredItem: -1,
    scaledHeight: null,
    scaledWidth: null
  };
  componentDidMount() {
    if (this.element) {
      const dimensions = this.element.getBoundingClientRect();
      const parentDimensions = this.element.parentElement.getBoundingClientRect();

      const width = dimensions.width;
      // TODO: throw if width is empty
      const parentWidth = parentDimensions.width;
      const scaledWidth = width * this.props.scaleX;
      const fullWidth = scaledWidth * this.count;

      const height = dimensions.height;
      const scaledHeight = height * this.props.scaleY;
      const diffHeight = scaledHeight - height;
      this.lastPage = Math.floor(parentWidth / scaledWidth);
      if (!this.pageItems) this.pageItems = this.lastPage;
      if (fullWidth > parentWidth) {
        this.showCarousel = true;
        const remaining = this.count - this.lastPage;
        if (remaining < this.lastPage) {
          this.pages = 2;
          this.pageItems = remaining;
        } else {
          this.pages = Math.ceil(remaining / this.pageItems) + 1;
        }
      }
      this.setState({
        height,
        width,
        scaledHeight,
        scaledWidth,
        diffWidth: scaledWidth - width,
        diffHeight,
        top: dimensions.top * this.props.scaleY,
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
  onMouseLeave = () => {
    this.setState({
      hoveredItem: -1
    });
  };
  progress = pageNo => {
    this.setState({
      currentPage: pageNo
    });
  };
  prev = () => {
    this.setState(({ currentPage }) => {
      if (1 < currentPage && currentPage <= this.pages) {
        return { currentPage: currentPage - 1 };
      } else return { currentPage };
    });
  };
  next = () => {
    this.setState(({ currentPage }) => {
      if (1 <= currentPage && currentPage < this.pages) {
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
      lastPage,
      count
    } = this;
    const {
      children,
      renderPrev,
      renderNext,
      renderProgress,
      speed,
      scaleX,
      scaleY
    } = props;
    const {
      height,
      scaledHeight,
      scaledWidth,
      parentWidth,
      hoveredItem,
      position,
      currentPage,
      top,
      diffWidth,
      width,
      diffHeight
    } = state;

    if (!children || count < 0) {
      return <div>Gimme some children</div>;
    }
    if (!height) {
      const firstChild = reactChildren[0];
      return <NodeResolver innerRef={getRef}>{firstChild}</NodeResolver>;
    }
    const itemData = reactChildren.map((child, key) => {
      const childStyles = getChildStyles(
        hoveredItem,
        key,
        scaleX,
        scaleY,
        diffWidth
      );
      return {
        child,
        childStyles,
        key,
        onMouseEnter,
        onMouseLeave,
        diffHeight,
        diffWidth
      };
    });
    const prevButtonDisabled = currentPage === 1 || hoveredItem > -1;
    const nextButtonDisabled = currentPage === pages || hoveredItem > -1;
    const pageArray = new Array(pages).fill(1);
    const scrollToItem =
      currentPage === pages
        ? count - this.lastPage
        : (currentPage - 1) * pageItems;
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
          <React.Fragment>
            {renderPrev({
              disabled: prevButtonDisabled,
              onClick: prev,
              basicStyle: {
                height: scaledHeight,
                top: `${diffHeight}px`,
                left: 0
              }
            })}
          </React.Fragment>
        )}
        <AnimatedList
          itemData={itemData}
          height={scaledHeight}
          itemSize={width + 10}
          direction="horizontal"
          itemCount={count}
          width={parentWidth}
          style={{ overflow: "hidden", margin: `${diffHeight / 2}px 0` }}
          scrollToItem={scrollToItem}
          duration={speed}
        >
          {ItemRenderer}
        </AnimatedList>
        {showCarousel && (
          <React.Fragment>
            {renderNext({
              disabled: nextButtonDisabled,
              onClick: next,
              basicStyle: {
                height: scaledHeight,
                right: 0,
                top: `${diffHeight}px`
              }
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Carousel;

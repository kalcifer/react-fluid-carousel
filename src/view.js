import React, { Component, Children } from "react";
import { FixedSizeList as List } from "react-window";
import NodeResolver from "react-node-resolver";
import AnimatedList from "./animated-list";
import { findPrevNextObjs } from "./util";
import {
  padding,
  addTop,
  childAfterHoverVals,
  childBeforeHoverVals,
  childHoverVals,
  containerStyle,
  carouselObjStyle,
  carouselStyle,
  inline
} from "./const";
const listRef = React.createRef();
const outerRef = React.createRef();
export default class Carousel extends Component {
  static defaultProps = {
    slidesToScroll: null,
    speed: 10
  };
  state = {
    height: null,
    width: null,
    parentWidth: null,
    position: 0,
    fullWidth: null,
    prev: false,
    next: false,
    hoveredItem: null
  };
  element = null;
  reactChildren = [];
  showCarousel = false;
  childRefs = [];
  constructor(props) {
    super();
    this.reactChildren = React.Children.toArray(props.children);
    this.childRefs = this.reactChildren.map(child => React.createRef());
  }
  componentDidMount() {
    if (this.element) {
      const dimensions = this.element.getBoundingClientRect();
      const parentDimensions = this.element.parentElement.getBoundingClientRect();
      const count = React.Children.count(this.props.children);
      const parentWidth = parentDimensions.width;
      const fullWidth = dimensions.width * count + padding * count * 2;
      if (fullWidth > parentWidth) {
        this.showCarousel = true;
      }
      this.setState({
        height: dimensions.height,
        width: dimensions.width,
        top: dimensions.top + addTop,
        parentWidth,
        fullWidth
      });
    }
  }

  getRef = element => {
    this.element = element;
  };

  prev = () => {
    const { position, parentWidth, width } = this.state;
    if (position !== 0) {
      const slidesToScroll =
        this.props.slidesToScroll || Math.ceil(parentWidth / width);
      this.setState({
        position: position - slidesToScroll,
        prev: true,
        next: false
      });
    }
  };
  next = () => {
    const { position, parentWidth, width } = this.state;
    const slidesToScroll =
      this.props.slidesToScroll || Math.ceil(parentWidth / width);
    const count = React.Children.count(this.props.children);
    const nextPos = (position + slidesToScroll) % count;
    this.setState({
      position: nextPos,
      prev: false,
      next: true
    });
  };
  progress = pos => {
    this.setState({
      position: pos
    });
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
  render() {
    const {
      children,
      renderPrev,
      renderNext,
      renderProgress,
      speed
    } = this.props;
    const {
      hoveredItem,
      height,
      position,
      parentWidth,
      fullWidth,
      width
    } = this.state;

    const count = React.Children.count(children);

    if (!children || count < 0) {
      return <div>Gimme some children</div>;
    }
    if (!height) {
      const firstChild = this.reactChildren[0];
      return <NodeResolver innerRef={this.getRef}>{firstChild}</NodeResolver>;
    }

    const translateValue = -position;
    let prevKeyList = [];
    let nextKeyList = [];
    if (hoveredItem) {
      const lists = findPrevNextObjs(hoveredItem, this.childRefs);
      prevKeyList = lists[0];
      nextKeyList = lists[1];
    }
    const prevButtonDisabled =
      this.state.position === 0 || this.state.hoveredItem;
    const nextButtonDisabled =
      this.state.position > this.state.fullWidth - this.state.parentWidth ||
      this.state.hoveredItem;

    const pageSize = Math.ceil(parentWidth / width);
    const noOfPages = Math.ceil(count / pageSize);
    const pageArray = new Array(noOfPages).fill(1);
    return (
      <div style={{ ...containerStyle, width: parentWidth }}>
        <div
          style={{
            position: "absolute",
            zIndex: "5",
            height: "20px",
            boxSizing: "border-box"
          }}
        >
          {this.showCarousel &&
            pageArray.map((item, index) => {
              const isEnabled = position === index * this.state.width * padding;
              return (
                <span
                  style={{
                    cursor: "pointer",
                    display: "inline-block",
                    marginRight: "5px"
                  }}
                  onClick={() =>
                    this.progress(index * this.state.width * padding)
                  }
                >
                  {renderProgress({ enabled: isEnabled })}
                </span>
              );
            })}
        </div>
        {this.showCarousel && (
          <button style={inline}>
            {renderPrev({
              disabled: prevButtonDisabled,
              onClick: this.prev,
              basicStyle: { height, top: `${this.state.top}px` }
            })}
          </button>
        )}

        <AnimatedList
          direction="horizontal"
          height={height + 20}
          itemCount={count}
          itemSize={width + 20}
          width={parentWidth}
          style={{ overflow: "hidden" }}
          ref={listRef}
          outerRef={outerRef}
          duration={speed}
          scrollToItem={this.state.position}
        >
          {({ index: key, style }) => {
            let childStyles = {};
            if (key == hoveredItem) {
              childStyles = childHoverVals;
            }
            if (prevKeyList.indexOf(`${key}`) > -1) {
              childStyles = childBeforeHoverVals;
            }
            if (nextKeyList.indexOf(`${key}`) > -1) {
              childStyles = childAfterHoverVals;
            }
            childStyles = {
              ...childStyles,
              transition: "transform 5s",
              cursor: "pointer"
            };

            return (
              <div
                style={{
                  ...childStyles,
                  ...carouselObjStyle,
                  ...style,
                  ...{ padding: "10px" }
                }}
                ref={this.childRefs[key]}
                data-key={key}
                onMouseEnter={() => this.onMouseEnter(key)}
                onMouseLeave={() => this.onMouseLeave(key)}
              >
                {this.reactChildren[key]}
              </div>
            );
          }}
        </AnimatedList>
        {this.showCarousel && (
          <button style={inline}>
            {renderNext({
              disabled: nextButtonDisabled,
              onClick: this.next,
              basicStyle: { height, right: 0, top: `${this.state.top}px` }
            })}
          </button>
        )}
      </div>
    );
  }
}

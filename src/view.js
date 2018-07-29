import React, { Component, Children } from "react";
import NodeResolver from "react-node-resolver";

const childHoverVals = {
  transform: "scale(1.2)"
};

let childBeforeHoverVals = {
  transform: "translateX(-10px)"
};
let childAfterHoverVals = {
  transform: "translateX(10px)"
};

const containerStyle = {
  overflowX: "hidden",
  position: "relative"
};

const carouselStyle = {
  display: "flex",
  padding: "20px 0"
};

const carouselObjStyle = {
  padding: "0 10px"
};

const padding = 10;
export default class Carousel extends Component {
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
  constructor(props) {
    super();
    this.reactChildren = React.Children.toArray(props.children);
  }
  componentDidMount() {
    if (this.element) {
      const dimensions = this.element.getBoundingClientRect();
      const parentDimensions = this.element.parentElement.getBoundingClientRect();
      const count = React.Children.count(this.props.children);
      this.setState({
        height: dimensions.height,
        width: dimensions.width,
        parentWidth: parentDimensions.width,
        fullWidth: dimensions.width * count + padding * count * 2
      });
    }
  }

  getRef = element => {
    this.element = element;
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     this.state.height === nextState.height &&
  //     this.state.position === nextState.position &&
  //     this.state.hoveredItem === nextState.hoveredItem
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }
  prev = () => {
    if (this.state.position !== 0) {
      this.setState({
        position: this.state.position - this.state.width - padding,
        prev: true,
        next: false
      });
    }
  };
  next = () => {
    this.setState({
      position: this.state.position + this.state.width + padding,
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
    const { children, renderPrev, renderNext, renderProgress } = this.props;
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
      const lists = findPrevNextObjs(hoveredItem, this.reactChildren);
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
        <div style={{ position: "absolute", zIndex: "5" }}>
          {pageArray.map((item, index) => {
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
        <div
          style={{
            ...carouselStyle,
            height,
            width: fullWidth,
            transform: `translateX(${translateValue}px)`,
            transition: "1s"
          }}
        >
          {this.reactChildren.map(child => {
            let childStyles = {};
            const { key } = child;
            if (key === hoveredItem) {
              childStyles = childHoverVals;
            }
            if (prevKeyList.indexOf(key) > -1) {
              childStyles = childBeforeHoverVals;
            }
            if (nextKeyList.indexOf(key) > -1) {
              childStyles = childAfterHoverVals;
            }
            childStyles = {
              ...childStyles,
              transition: "0.5s",
              cursor: "pointer"
            };
            return (
              <div
                style={{ height, width, ...childStyles, ...carouselObjStyle }}
                onMouseEnter={() => this.onMouseEnter(key)}
                onMouseLeave={() => this.onMouseLeave(key)}
              >
                {child}
              </div>
            );
          })}
        </div>
        {renderPrev({
          disabled: prevButtonDisabled,
          onClick: this.prev,
          basicStyle: { height }
        })}
        {renderNext({
          disabled: nextButtonDisabled,
          onClick: this.next,
          basicStyle: { height, right: 0 }
        })}
      </div>
    );
  }
}

export const findPrevNextObjs = (findKey, children) => {
  let prevKeyList = [];
  let nextKeyList = [];
  let prevObj;
  let currentObj;
  let nextObj;
  children.forEach(child => {
    if (currentObj && !nextObj) {
      nextObj = child;
      nextKeyList.push(child.key);
    } else if (currentObj && nextObj && nextKeyList.length > 0) {
      nextKeyList.push(child.key);
    }
    if (child.key === findKey) {
      currentObj = child;
    }
    if (prevObj && !currentObj && !nextObj) {
      prevKeyList.push(child.key);
    }
    if (!prevObj && !currentObj) {
      prevObj = child;
      prevKeyList.push(prevObj.key);
    }
  });
  debugger; //eslint-disable-line
  return [prevKeyList, nextKeyList];
};

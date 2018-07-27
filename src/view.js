import React, { Component } from "react";
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

  componentDidMount() {
    if (this.element) {
      console.log(this.element.getBoundingClientRect());
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

    let prevKey;
    let nextKey;
    const count = React.Children.count(children);
    if (!children || count < 0) {
      return <div>Gimme some children</div>;
    }
    if (!height) {
      const firstChild = React.Children.toArray(children)[0];
      return <NodeResolver innerRef={this.getRef}>{firstChild}</NodeResolver>;
    }

    const translateValue = -position;
    if (hoveredItem) {
      let prevObj;
      let currentObj;
      React.Children.forEach(children, child => {
        if (currentObj && !nextKey) {
          nextKey = child.key;
        }
        if (child.key === hoveredItem) {
          if (prevObj) {
            prevKey = prevObj.key;
          }
          currentObj = child;
        }
        prevObj = child;
      });
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
          {React.Children.map(children, child => {
            let childStyles = {};
            const { key } = child;
            if (key === hoveredItem) {
              childStyles = childHoverVals;
            }
            if (key === prevKey) {
              childStyles = childBeforeHoverVals;
            }
            if (key === nextKey) {
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

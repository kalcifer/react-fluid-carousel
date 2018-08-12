import React, { Component, createRef } from "react";
import { FixedSizeList as List } from "react-window";

function defaultEasing(delta) {
  return delta;
}

export default class AnimatedList extends Component {
  static defaultProps = {
    duration: 1000,
    easing: defaultEasing,
    onAnimationComplete: () => {}
  };

  listRef = createRef();

  _scrollOffsetInitial = 0;
  _scrollOffsetFinal = 0;

  componentDidMount() {
    if (this.props.scrollToItem) {
      this._initAnimation();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.scrollToItem !== prevProps.scrollToItem) {
      this._initAnimation();
    }
  }

  render() {
    return <List {...this.props} onScroll={this.onScroll} ref={this.listRef} />;
  }

  _animate() {
    requestAnimationFrame(() => {
      const { duration, easing } = this.props;
      const now = performance.now();
      const ellapsed = now - this._animationStartTime;
      const scrollDelta = this._scrollOffsetFinal - this._scrollOffsetInitial;
      const easedTime = easing(Math.min(1, ellapsed / duration));
      const scrollOffset = this._scrollOffsetInitial + scrollDelta * easedTime;

      this.listRef.current.scrollTo(scrollOffset);

      if (ellapsed < duration) {
        this._animate();
      } else {
        this._animationStartTime = undefined;
        this._scrollOffsetInitial = this._scrollOffsetFinal;
        this.props.onAnimationComplete();
      }
    });
  }

  _initAnimation() {
    if (this._animationStartTime) {
      return;
      // throw Error("Animation in progress"); // You handle this however you want.
    }

    const { itemSize, scrollToItem } = this.props;

    this._scrollOffsetFinal = scrollToItem * itemSize;
    this._animationStartTime = performance.now();
    this._animate();
  }

  onScroll = ({ scrollOffset, scrollUpdateWasRequested, scrollDirection }) => {
    if (!scrollUpdateWasRequested) {
      this._scrollOffsetInitial = scrollOffset;
    }
  };
}

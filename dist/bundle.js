'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var childHoverVals = {
  transform: "scale(1.2)"
};

var childBeforeHoverVals = {
  transform: "translateX(-10px)"
};
var childAfterHoverVals = {
  transform: "translateX(10px)"
};

var containerStyle = {
  "overflow-x": "hidden",
  position: "relative"
};

var carouselStyle = {
  display: "flex",
  padding: "20px 0"
};

var carouselObjStyle = {
  padding: "0 10px"
};

var prevNextStyle = {
  position: "absolute",
  "margin-top": "20px",
  "z-index": "10",
  content: "<",
  width: "40px",
  background: "black",
  border: "black",
  opacity: "0.5",
  top: "0"
};

var noHoverStyle = {
  opacity: "0.8",
  outline: "none",
  cursor: "pointer"
};

var padding = 10;

var Carousel = function (_Component) {
  inherits(Carousel, _Component);

  function Carousel() {
    classCallCheck(this, Carousel);

    var _this = possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this));

    _this.state = {
      height: null,
      width: null,
      parentWidth: null,
      position: 0,
      fullWidth: null,
      prev: false,
      next: false,
      hoverTransitionKey: null
    };

    _this.prev = function () {
      if (_this.state.position !== 0) {
        _this.setState({
          position: _this.state.position - _this.state.width - padding,
          prev: true,
          next: false
        });
      }
    };

    _this.next = function () {
      _this.setState({
        position: _this.state.position + _this.state.width + padding,
        prev: false,
        next: true
      });
    };

    _this.onMouseEnter = function (key) {
      _this.setState({
        hoverTransitionKey: key
      });
    };

    _this.onMouseLeave = function (key) {
      _this.setState({
        hoverTransitionKey: null
      });
    };

    _this.refDOM = React__default.createRef();
    return _this;
  }

  createClass(Carousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var element = this.refDOM.current;
      var dimensions = element.firstChild.getBoundingClientRect();
      var parentDimensions = element.parentElement.getBoundingClientRect();
      var count = React__default.Children.count(this.props.children);
      this.setState({
        height: dimensions.height,
        width: dimensions.width,
        parentWidth: parentDimensions.width,
        fullWidth: dimensions.width * count + padding * count * 2
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.state.height === nextState.height && this.state.position === nextState.position && this.state.hoverTransitionKey === nextState.hoverTransitionKey) {
        return false;
      }
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var children = this.props.children;
      var _state = this.state,
          hoverTransitionKey = _state.hoverTransitionKey,
          height = _state.height,
          position = _state.position,
          parentWidth = _state.parentWidth,
          fullWidth = _state.fullWidth,
          width = _state.width;


      var prevKey = void 0;
      var nextKey = void 0;
      var count = React__default.Children.count(children);
      if (!children || count < 0) {
        return React__default.createElement(
          "div",
          null,
          "Gimme some children"
        );
      }
      if (!height) {
        var firstChild = React__default.Children.toArray(children)[0];
        return React__default.createElement(
          "div",
          { ref: this.refDOM, style: { opacity: 0 } },
          firstChild
        );
      }

      var translateValue = -position;
      if (hoverTransitionKey) {
        var prevObj = void 0;
        var currentObj = void 0;
        React__default.Children.forEach(children, function (child) {
          if (currentObj && !nextKey) {
            nextKey = child.key;
          }
          if (child.key === hoverTransitionKey) {
            if (prevObj) {
              prevKey = prevObj.key;
            }
            currentObj = child;
          }
          prevObj = child;
        });
      }
      var prevButtonDisabled = this.state.position === 0 || this.state.hoverTransitionKey;
      var nextButtonDisabled = this.state.position > this.state.fullWidth - this.state.parentWidth || this.state.hoverTransitionKey;
      var prevStyle = prevButtonDisabled ? {} : noHoverStyle;
      var nextStyle = nextButtonDisabled ? {} : noHoverStyle;
      prevStyle = _extends({}, prevStyle, prevNextStyle);
      nextStyle = _extends({}, nextStyle, prevNextStyle);
      return React__default.createElement(
        "div",
        { style: _extends({}, containerStyle, { width: parentWidth }) },
        React__default.createElement(
          "div",
          {
            style: _extends({}, carouselStyle, {
              height: height,
              width: fullWidth,
              transform: "translateX(" + translateValue + "px)",
              transition: "1s"
            })
          },
          React__default.Children.map(children, function (child) {
            var childStyles = {};
            var key = child.key;

            if (key === hoverTransitionKey) {
              childStyles = childHoverVals;
            }
            if (key === prevKey) {
              childStyles = childBeforeHoverVals;
            }
            if (key === nextKey) {
              childStyles = childAfterHoverVals;
            }
            childStyles = _extends({}, childStyles, {
              transition: "0.5s",
              cursor: "pointer"
            });
            return React__default.createElement(
              "div",
              {
                style: _extends({ height: height, width: width }, childStyles, carouselObjStyle),
                onMouseEnter: function onMouseEnter() {
                  return _this2.onMouseEnter(key);
                },
                onMouseLeave: function onMouseLeave() {
                  return _this2.onMouseLeave(key);
                }
              },
              child
            );
          })
        ),
        React__default.createElement("button", {
          disabled: prevButtonDisabled,
          onClick: this.prev,
          style: _extends({ height: height }, prevStyle)
        }),
        React__default.createElement("button", {
          disabled: nextButtonDisabled,
          onClick: this.next,
          style: _extends({ height: height, right: 0 }, nextStyle)
        })
      );
    }
  }]);
  return Carousel;
}(React.Component);

module.exports = Carousel;

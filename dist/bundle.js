'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactDom = _interopDefault(require('react-dom'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var NodeResolver_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();





function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeResolver = function (_Component) {
  _inherits(NodeResolver, _Component);

  function NodeResolver() {
    _classCallCheck(this, NodeResolver);

    return _possibleConstructorReturn(this, (NodeResolver.__proto__ || Object.getPrototypeOf(NodeResolver)).apply(this, arguments));
  }

  _createClass(NodeResolver, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.innerRef((0, reactDom.findDOMNode)(this));
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.children !== this.props.children) {
        this.props.innerRef((0, reactDom.findDOMNode)(this));
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.innerRef(null);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return NodeResolver;
}(React__default.Component);

exports.default = NodeResolver;
});

unwrapExports(NodeResolver_1);

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(NodeResolver_1).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});

var NodeResolver$1 = unwrapExports(lib);

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
  overflowX: "hidden",
  position: "relative"
};

var carouselStyle = {
  display: "flex",
  padding: "20px 0"
};

var carouselObjStyle = {
  padding: "0 10px"
};

var padding = 10;

var Carousel = function (_Component) {
  inherits(Carousel, _Component);

  function Carousel() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Carousel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      height: null,
      width: null,
      parentWidth: null,
      position: 0,
      fullWidth: null,
      prev: false,
      next: false,
      hoverTransitionKey: null
    }, _this.element = null, _this.getRef = function (element) {
      _this.element = element;
    }, _this.prev = function () {
      if (_this.state.position !== 0) {
        _this.setState({
          position: _this.state.position - _this.state.width - padding,
          prev: true,
          next: false
        });
      }
    }, _this.next = function () {
      _this.setState({
        position: _this.state.position + _this.state.width + padding,
        prev: false,
        next: true
      });
    }, _this.onMouseEnter = function (key) {
      _this.setState({
        hoverTransitionKey: key
      });
    }, _this.onMouseLeave = function (key) {
      _this.setState({
        hoverTransitionKey: null
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Carousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.element) {
        var dimensions = this.element.getBoundingClientRect();
        var parentDimensions = this.element.parentElement.getBoundingClientRect();
        var count = React__default.Children.count(this.props.children);
        this.setState({
          height: dimensions.height,
          width: dimensions.width,
          parentWidth: parentDimensions.width,
          fullWidth: dimensions.width * count + padding * count * 2
        });
      }
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

      var _props = this.props,
          children = _props.children,
          renderPrev = _props.renderPrev,
          renderNext = _props.renderNext;
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
          NodeResolver$1,
          { innerRef: this.getRef },
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
        renderPrev({
          disabled: prevButtonDisabled,
          onClick: this.prev,
          basicStyle: { height: height }
        }),
        renderNext({
          disabled: nextButtonDisabled,
          onClick: this.next,
          basicStyle: { height: height, right: 0 }
        })
      );
    }
  }]);
  return Carousel;
}(React.Component);

var prevNextStyle = {
  position: "absolute",
  marginTop: "20px",
  zIndex: "10",
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

var PrevButton = function PrevButton(_ref) {
  var disabled = _ref.disabled,
      onClick = _ref.onClick,
      basicStyle = _ref.basicStyle;

  var style = disabled ? {} : noHoverStyle;
  style = _extends({}, style, prevNextStyle);
  return React__default.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: _extends({}, basicStyle, style)
  });
};

var NextButton = function NextButton(_ref2) {
  var disabled = _ref2.disabled,
      onClick = _ref2.onClick,
      basicStyle = _ref2.basicStyle;

  var style = disabled ? {} : noHoverStyle;
  style = _extends({}, style, prevNextStyle);
  return React__default.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: _extends({}, basicStyle, style)
  });
};

var index = (function (_ref3) {
  var children = _ref3.children,
      renderPrev = _ref3.renderPrev,
      renderNext = _ref3.renderNext;
  return React__default.createElement(
    Carousel,
    {
      renderPrev: renderPrev || PrevButton,
      renderNext: renderNext || NextButton
    },
    children
  );
});

module.exports = index;

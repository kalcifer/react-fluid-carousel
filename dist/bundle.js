'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactDom = _interopDefault(require('react-dom'));

var simpleIsEqual = function simpleIsEqual(a, b) {
  return a === b;
};

function memoizeOne (resultFn) {
  var isEqual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : simpleIsEqual;

  var lastThis = void 0;
  var lastArgs = [];
  var lastResult = void 0;
  var calledOnce = false;

  var isNewArgEqualToLast = function isNewArgEqualToLast(newArg, index) {
    return isEqual(newArg, lastArgs[index]);
  };

  var result = function result() {
    for (var _len = arguments.length, newArgs = Array(_len), _key = 0; _key < _len; _key++) {
      newArgs[_key] = arguments[_key];
    }

    if (calledOnce && lastThis === this && newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
      return lastResult;
    }

    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    lastResult = resultFn.apply(this, newArgs);
    return lastResult;
  };

  return result;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

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

var IS_SCROLLING_DEBOUNCE_INTERVAL = 150;

var defaultItemKey = function defaultItemKey(_ref) {
  var columnIndex = _ref.columnIndex,
      rowIndex = _ref.rowIndex;
  return rowIndex + ':' + columnIndex;
};

function createGridComponent(_ref2) {
  var _class, _temp;

  var getColumnOffset = _ref2.getColumnOffset,
      getColumnStartIndexForOffset = _ref2.getColumnStartIndexForOffset,
      getColumnStopIndexForStartIndex = _ref2.getColumnStopIndexForStartIndex,
      getColumnWidth = _ref2.getColumnWidth,
      getEstimatedTotalHeight = _ref2.getEstimatedTotalHeight,
      getEstimatedTotalWidth = _ref2.getEstimatedTotalWidth,
      getOffsetForColumnAndAlignment = _ref2.getOffsetForColumnAndAlignment,
      getOffsetForRowAndAlignment = _ref2.getOffsetForRowAndAlignment,
      getRowHeight = _ref2.getRowHeight,
      getRowOffset = _ref2.getRowOffset,
      getRowStartIndexForOffset = _ref2.getRowStartIndexForOffset,
      getRowStopIndexForStartIndex = _ref2.getRowStopIndexForStartIndex,
      initInstanceProps = _ref2.initInstanceProps,
      shouldResetStyleCacheOnItemSizeChange = _ref2.shouldResetStyleCacheOnItemSizeChange,
      validateProps = _ref2.validateProps;

  return _temp = _class = function (_PureComponent) {
    inherits(Grid, _PureComponent);

    // Always use explicit constructor for React components.
    // It produces less code after transpilation. (#26)
    // eslint-disable-next-line no-useless-constructor
    function Grid(props) {
      classCallCheck(this, Grid);

      var _this = possibleConstructorReturn(this, _PureComponent.call(this, props));

      _this._instanceProps = initInstanceProps(_this.props, _this);
      _this._resetIsScrollingTimeoutId = null;
      _this.state = {
        isScrolling: false,
        horizontalScrollDirection: 'forward',
        scrollLeft: typeof _this.props.initialScrollLeft === 'number' ? _this.props.initialScrollLeft : 0,
        scrollTop: typeof _this.props.initialScrollTop === 'number' ? _this.props.initialScrollTop : 0,
        scrollUpdateWasRequested: false,
        verticalScrollDirection: 'forward'
      };
      _this._callOnItemsRendered = memoizeOne(function (overscanColumnStartIndex, overscanColumnStopIndex, overscanRowStartIndex, overscanRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex) {
        return _this.props.onItemsRendered({
          overscanColumnStartIndex: overscanColumnStartIndex,
          overscanColumnStopIndex: overscanColumnStopIndex,
          overscanRowStartIndex: overscanRowStartIndex,
          overscanRowStopIndex: overscanRowStopIndex,
          visibleColumnStartIndex: visibleColumnStartIndex,
          visibleColumnStopIndex: visibleColumnStopIndex,
          visibleRowStartIndex: visibleRowStartIndex,
          visibleRowStopIndex: visibleRowStopIndex
        });
      });
      _this._callOnScroll = memoizeOne(function (scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested) {
        return _this.props.onScroll({
          horizontalScrollDirection: horizontalScrollDirection,
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          verticalScrollDirection: verticalScrollDirection,
          scrollUpdateWasRequested: scrollUpdateWasRequested
        });
      });

      _this._getItemStyle = function (rowIndex, columnIndex) {
        var key = rowIndex + ':' + columnIndex;

        var itemStyleCache = _this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && _this.props.columnWidth, shouldResetStyleCacheOnItemSizeChange && _this.props.rowHeight);

        var style = void 0;
        if (itemStyleCache.hasOwnProperty(key)) {
          style = itemStyleCache[key];
        } else {
          itemStyleCache[key] = style = {
            position: 'absolute',
            left: getColumnOffset(_this.props, columnIndex, _this._instanceProps),
            top: getRowOffset(_this.props, rowIndex, _this._instanceProps),
            height: getRowHeight(_this.props, rowIndex, _this._instanceProps),
            width: getColumnWidth(_this.props, columnIndex, _this._instanceProps)
          };
        }

        return style;
      };

      _this._getItemStyleCache = memoizeOne(function (_, __) {
        return {};
      });

      _this._onScroll = function (event) {
        var _event$currentTarget = event.currentTarget,
            scrollLeft = _event$currentTarget.scrollLeft,
            scrollTop = _event$currentTarget.scrollTop;

        _this.setState(function (prevState) {
          if (prevState.scrollLeft === scrollLeft && prevState.scrollTop === scrollTop) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null;
          }

          return {
            isScrolling: true,
            horizontalScrollDirection: prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            verticalScrollDirection: prevState.scrollTop < scrollTop ? 'forward' : 'backward',
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };

      _this._outerRefSetter = function (ref) {
        var outerRef = _this.props.outerRef;


        _this._outerRef = ref;

        if (typeof outerRef === 'function') {
          outerRef(ref);
        } else if (outerRef != null && (typeof outerRef === 'undefined' ? 'undefined' : _typeof(outerRef)) === 'object' && outerRef.hasOwnProperty('current')) {
          outerRef.current = ref;
        }
      };

      _this._resetIsScrollingDebounced = function () {
        if (_this._resetIsScrollingTimeoutId !== null) {
          clearTimeout(_this._resetIsScrollingTimeoutId);
        }

        _this._resetIsScrollingTimeoutId = setTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
      };

      _this._resetIsScrollingDebounced = function () {
        if (_this._resetIsScrollingTimeoutId !== null) {
          clearTimeout(_this._resetIsScrollingTimeoutId);
        }

        _this._resetIsScrollingTimeoutId = setTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
      };

      _this._resetIsScrolling = function () {
        _this._resetIsScrollingTimeoutId = null;

        _this.setState({ isScrolling: false }, function () {
          // Clear style cache after state update has been committed.
          // This way we don't break pure sCU for items that don't use isScrolling param.
          _this._getItemStyleCache(-1);
        });
      };

      return _this;
    }

    Grid.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      validateSharedProps(nextProps);
      validateProps(nextProps);
      return null;
    };

    Grid.prototype.scrollTo = function scrollTo(_ref3) {
      var scrollLeft = _ref3.scrollLeft,
          scrollTop = _ref3.scrollTop;

      this.setState(function (prevState) {
        return {
          horizontalScrollDirection: prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          scrollUpdateWasRequested: true,
          verticalScrollDirection: prevState.scrollTop < scrollTop ? 'forward' : 'backward'
        };
      }, this._resetIsScrollingDebounced);
    };

    Grid.prototype.scrollToItem = function scrollToItem(_ref4) {
      var _ref4$align = _ref4.align,
          align = _ref4$align === undefined ? 'auto' : _ref4$align,
          columnIndex = _ref4.columnIndex,
          rowIndex = _ref4.rowIndex;
      var _state = this.state,
          scrollLeft = _state.scrollLeft,
          scrollTop = _state.scrollTop;


      this.scrollTo({
        scrollLeft: getOffsetForColumnAndAlignment(this.props, columnIndex, align, scrollLeft, this._instanceProps),
        scrollTop: getOffsetForRowAndAlignment(this.props, rowIndex, align, scrollTop, this._instanceProps)
      });
    };

    Grid.prototype.componentDidMount = function componentDidMount() {
      var _props = this.props,
          initialScrollLeft = _props.initialScrollLeft,
          initialScrollTop = _props.initialScrollTop;

      if (typeof initialScrollLeft === 'number' && this._outerRef != null) {
        this._outerRef.scrollLeft = initialScrollLeft;
      }
      if (typeof initialScrollTop === 'number' && this._outerRef != null) {
        this._outerRef.scrollTop = initialScrollTop;
      }

      this._callPropsCallbacks();
    };

    Grid.prototype.componentDidUpdate = function componentDidUpdate() {
      var _state2 = this.state,
          scrollLeft = _state2.scrollLeft,
          scrollTop = _state2.scrollTop,
          scrollUpdateWasRequested = _state2.scrollUpdateWasRequested;

      if (scrollUpdateWasRequested && this._outerRef !== null) {
        this._outerRef.scrollLeft = scrollLeft;
        this._outerRef.scrollTop = scrollTop;
      }

      this._callPropsCallbacks();
    };

    Grid.prototype.componentWillUnmount = function componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }
    };

    Grid.prototype.render = function render() {
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          columnCount = _props2.columnCount,
          height = _props2.height,
          innerRef = _props2.innerRef,
          innerTagName = _props2.innerTagName,
          itemData = _props2.itemData,
          _props2$itemKey = _props2.itemKey,
          itemKey = _props2$itemKey === undefined ? defaultItemKey : _props2$itemKey,
          outerTagName = _props2.outerTagName,
          rowCount = _props2.rowCount,
          style = _props2.style,
          useIsScrolling = _props2.useIsScrolling,
          width = _props2.width;
      var isScrolling = this.state.isScrolling;

      var _getHorizontalRangeTo = this._getHorizontalRangeToRender(),
          columnStartIndex = _getHorizontalRangeTo[0],
          columnStopIndex = _getHorizontalRangeTo[1];

      var _getVerticalRangeToRe = this._getVerticalRangeToRender(),
          rowStartIndex = _getVerticalRangeToRe[0],
          rowStopIndex = _getVerticalRangeToRe[1];

      var items = [];
      if (columnCount > 0 && rowCount) {
        for (var _rowIndex = rowStartIndex; _rowIndex <= rowStopIndex; _rowIndex++) {
          for (var _columnIndex = columnStartIndex; _columnIndex <= columnStopIndex; _columnIndex++) {
            items.push(React.createElement(children, {
              columnIndex: _columnIndex,
              data: itemData,
              isScrolling: useIsScrolling ? isScrolling : undefined,
              key: itemKey({ columnIndex: _columnIndex, rowIndex: _rowIndex }),
              rowIndex: _rowIndex,
              style: this._getItemStyle(_rowIndex, _columnIndex)
            }));
          }
        }
      }

      // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.
      var estimatedTotalHeight = getEstimatedTotalHeight(this.props, this._instanceProps);
      var estimatedTotalWidth = getEstimatedTotalWidth(this.props, this._instanceProps);

      return React.createElement(outerTagName, {
        className: className,
        onScroll: this._onScroll,
        ref: this._outerRefSetter,
        style: _extends({
          position: 'relative',
          height: height,
          width: width,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform'
        }, style)
      }, React.createElement(innerTagName, {
        children: items,
        ref: innerRef,
        style: {
          height: estimatedTotalHeight,
          overflow: 'hidden',
          pointerEvents: isScrolling ? 'none' : '',
          width: estimatedTotalWidth
        }
      }));
    };

    Grid.prototype._callPropsCallbacks = function _callPropsCallbacks() {
      var _props3 = this.props,
          columnCount = _props3.columnCount,
          onItemsRendered = _props3.onItemsRendered,
          onScroll = _props3.onScroll,
          rowCount = _props3.rowCount;


      if (typeof onItemsRendered === 'function') {
        if (columnCount > 0 && rowCount > 0) {
          var _getHorizontalRangeTo2 = this._getHorizontalRangeToRender(),
              _overscanColumnStartIndex = _getHorizontalRangeTo2[0],
              _overscanColumnStopIndex = _getHorizontalRangeTo2[1],
              _visibleColumnStartIndex = _getHorizontalRangeTo2[2],
              _visibleColumnStopIndex = _getHorizontalRangeTo2[3];

          var _getVerticalRangeToRe2 = this._getVerticalRangeToRender(),
              _overscanRowStartIndex = _getVerticalRangeToRe2[0],
              _overscanRowStopIndex = _getVerticalRangeToRe2[1],
              _visibleRowStartIndex = _getVerticalRangeToRe2[2],
              _visibleRowStopIndex = _getVerticalRangeToRe2[3];

          this._callOnItemsRendered(_overscanColumnStartIndex, _overscanColumnStopIndex, _overscanRowStartIndex, _overscanRowStopIndex, _visibleColumnStartIndex, _visibleColumnStopIndex, _visibleRowStartIndex, _visibleRowStopIndex);
        }
      }

      if (typeof onScroll === 'function') {
        var _state3 = this.state,
            _horizontalScrollDirection = _state3.horizontalScrollDirection,
            _scrollLeft = _state3.scrollLeft,
            _scrollTop = _state3.scrollTop,
            _scrollUpdateWasRequested = _state3.scrollUpdateWasRequested,
            _verticalScrollDirection = _state3.verticalScrollDirection;

        this._callOnScroll(_scrollLeft, _scrollTop, _horizontalScrollDirection, _verticalScrollDirection, _scrollUpdateWasRequested);
      }
    };

    // Lazily create and cache item styles while scrolling,
    // So that pure component sCU will prevent re-renders.
    // We maintain this cache, and pass a style prop rather than index,
    // So that List can clear cached styles and force item re-render if necessary.


    Grid.prototype._getHorizontalRangeToRender = function _getHorizontalRangeToRender() {
      var _props4 = this.props,
          columnCount = _props4.columnCount,
          overscanCount = _props4.overscanCount;
      var _state4 = this.state,
          horizontalScrollDirection = _state4.horizontalScrollDirection,
          scrollLeft = _state4.scrollLeft;


      var startIndex = getColumnStartIndexForOffset(this.props, scrollLeft, this._instanceProps);
      var stopIndex = getColumnStopIndexForStartIndex(this.props, startIndex, scrollLeft, this._instanceProps);

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
      var overscanBackward = horizontalScrollDirection === 'backward' ? Math.max(1, overscanCount) : 1;
      var overscanForward = horizontalScrollDirection === 'forward' ? Math.max(1, overscanCount) : 1;

      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(columnCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };

    Grid.prototype._getVerticalRangeToRender = function _getVerticalRangeToRender() {
      var _props5 = this.props,
          rowCount = _props5.rowCount,
          overscanCount = _props5.overscanCount;
      var _state5 = this.state,
          verticalScrollDirection = _state5.verticalScrollDirection,
          scrollTop = _state5.scrollTop;


      var startIndex = getRowStartIndexForOffset(this.props, scrollTop, this._instanceProps);
      var stopIndex = getRowStopIndexForStartIndex(this.props, startIndex, scrollTop, this._instanceProps);

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
      var overscanBackward = verticalScrollDirection === 'backward' ? Math.max(1, overscanCount) : 1;
      var overscanForward = verticalScrollDirection === 'forward' ? Math.max(1, overscanCount) : 1;

      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(rowCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };

    return Grid;
  }(React.PureComponent), _class.defaultProps = {
    innerTagName: 'div',
    outerTagName: 'div',
    overscanCount: 1,
    useIsScrolling: false
  }, _temp;
}

var validateSharedProps = function validateSharedProps(_ref5) {
  var children = _ref5.children,
      height = _ref5.height,
      width = _ref5.width;

  if (process.env.NODE_ENV !== 'production') {
    if (typeof children !== 'function') {
      throw Error('An invalid "children" prop has been specified. ' + 'Value should be a function that creates a React element. ' + ('"' + (children === null ? 'null' : typeof children === 'undefined' ? 'undefined' : _typeof(children)) + '" was specified.'));
    }

    if (typeof width !== 'number') {
      throw Error('An invalid "width" prop has been specified. ' + 'Grids must specify a number for width. ' + ('"' + (width === null ? 'null' : typeof width === 'undefined' ? 'undefined' : _typeof(width)) + '" was specified.'));
    }

    if (typeof height !== 'number') {
      throw Error('An invalid "height" prop has been specified. ' + 'Grids must specify a number for height. ' + ('"' + (height === null ? 'null' : typeof height === 'undefined' ? 'undefined' : _typeof(height)) + '" was specified.'));
    }
  }
};

var DEFAULT_ESTIMATED_ITEM_SIZE = 50;

var getEstimatedTotalHeight = function getEstimatedTotalHeight(_ref, _ref2) {
  var rowCount = _ref.rowCount;
  var rowMetadataMap = _ref2.rowMetadataMap,
      estimatedRowHeight = _ref2.estimatedRowHeight,
      lastMeasuredRowIndex = _ref2.lastMeasuredRowIndex;

  var totalSizeOfMeasuredRows = 0;

  if (lastMeasuredRowIndex >= 0) {
    var itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  var numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

var getEstimatedTotalWidth = function getEstimatedTotalWidth(_ref3, _ref4) {
  var columnCount = _ref3.columnCount;
  var columnMetadataMap = _ref4.columnMetadataMap,
      estimatedColumnWidth = _ref4.estimatedColumnWidth,
      lastMeasuredColumnIndex = _ref4.lastMeasuredColumnIndex;

  var totalSizeOfMeasuredRows = 0;

  if (lastMeasuredColumnIndex >= 0) {
    var itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  var numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

var getItemMetadata = function getItemMetadata(itemType, props, index, instanceProps) {
  var itemMetadataMap = void 0,
      itemSize = void 0,
      lastMeasuredIndex = void 0;
  if (itemType === 'column') {
    itemMetadataMap = instanceProps.columnMetadataMap;
    itemSize = props.columnWidth;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    itemSize = props.rowHeight;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  if (index > lastMeasuredIndex) {
    var _offset = 0;
    if (lastMeasuredIndex >= 0) {
      var itemMetadata = itemMetadataMap[lastMeasuredIndex];
      _offset = itemMetadata.offset + itemMetadata.size;
    }

    for (var i = lastMeasuredIndex + 1; i <= index; i++) {
      var _size = itemSize(i);

      itemMetadataMap[i] = {
        offset: _offset,
        size: _size
      };

      _offset += _size;
    }

    if (itemType === 'column') {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }

  return itemMetadataMap[index];
};

var findNearestItem = function findNearestItem(itemType, props, instanceProps, offset) {
  var itemMetadataMap = void 0,
      lastMeasuredIndex = void 0;
  if (itemType === 'column') {
    itemMetadataMap = instanceProps.columnMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  var lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;

  if (lastMeasuredItemOffset >= offset) {
    // If we've already measured items within this range just use a binary search as it's faster.
    return findNearestItemBinarySearch(itemType, props, instanceProps, lastMeasuredIndex, 0, offset);
  } else {
    // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    // The overall complexity for this approach is O(log n).
    return findNearestItemExponentialSearch(itemType, props, instanceProps, Math.max(0, lastMeasuredIndex), offset);
  }
};

var findNearestItemBinarySearch = function findNearestItemBinarySearch(itemType, props, instanceProps, high, low, offset) {
  while (low <= high) {
    var middle = low + Math.floor((high - low) / 2);
    var currentOffset = getItemMetadata(itemType, props, middle, instanceProps).offset;

    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};

var findNearestItemExponentialSearch = function findNearestItemExponentialSearch(itemType, props, instanceProps, index, offset) {
  var itemCount = itemType === 'column' ? props.columnCount : props.rowCount;
  var interval = 1;

  while (index < itemCount && getItemMetadata(itemType, props, index, instanceProps).offset < offset) {
    index += interval;
    interval *= 2;
  }

  return findNearestItemBinarySearch(itemType, props, instanceProps, Math.min(index, itemCount - 1), Math.floor(index / 2), offset);
};

var getOffsetForIndexAndAlignment = function getOffsetForIndexAndAlignment(itemType, props, index, align, scrollOffset, instanceProps) {
  var size = itemType === 'column' ? props.width : props.height;
  var itemMetadata = getItemMetadata(itemType, props, index, instanceProps);

  // Get estimated total size after ItemMetadata is computed,
  // To ensure it reflects actual measurements instead of just estimates.
  var estimatedTotalSize = itemType === 'column' ? getEstimatedTotalWidth(props, instanceProps) : getEstimatedTotalHeight(props, instanceProps);

  var maxOffset = Math.min(estimatedTotalSize - size, itemMetadata.offset);
  var minOffset = Math.max(0, itemMetadata.offset - size + itemMetadata.size);

  switch (align) {
    case 'start':
      return maxOffset;
    case 'end':
      return minOffset;
    case 'center':
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    case 'auto':
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
  }
};

var VariableSizeGrid = /*#__PURE__*/createGridComponent({
  getColumnOffset: function getColumnOffset(props, index, instanceProps) {
    return getItemMetadata('column', props, index, instanceProps).offset;
  },

  getColumnStartIndexForOffset: function getColumnStartIndexForOffset(props, scrollLeft, instanceProps) {
    return findNearestItem('column', props, instanceProps, scrollLeft);
  },

  getColumnStopIndexForStartIndex: function getColumnStopIndexForStartIndex(props, startIndex, scrollLeft, instanceProps) {
    var columnCount = props.columnCount,
        width = props.width;


    var itemMetadata = getItemMetadata('column', props, startIndex, instanceProps);
    var maxOffset = scrollLeft + width;

    var offset = itemMetadata.offset + itemMetadata.size;
    var stopIndex = startIndex;

    while (stopIndex < columnCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata('column', props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  getColumnWidth: function getColumnWidth(props, index, instanceProps) {
    return instanceProps.columnMetadataMap[index].size;
  },

  getEstimatedTotalHeight: getEstimatedTotalHeight,
  getEstimatedTotalWidth: getEstimatedTotalWidth,

  getOffsetForColumnAndAlignment: function getOffsetForColumnAndAlignment(props, index, align, scrollOffset, instanceProps) {
    return getOffsetForIndexAndAlignment('column', props, index, align, scrollOffset, instanceProps);
  },

  getOffsetForRowAndAlignment: function getOffsetForRowAndAlignment(props, index, align, scrollOffset, instanceProps) {
    return getOffsetForIndexAndAlignment('row', props, index, align, scrollOffset, instanceProps);
  },

  getRowOffset: function getRowOffset(props, index, instanceProps) {
    return getItemMetadata('row', props, index, instanceProps).offset;
  },

  getRowHeight: function getRowHeight(props, index, instanceProps) {
    return instanceProps.rowMetadataMap[index].size;
  },

  getRowStartIndexForOffset: function getRowStartIndexForOffset(props, scrollTop, instanceProps) {
    return findNearestItem('row', props, instanceProps, scrollTop);
  },

  getRowStopIndexForStartIndex: function getRowStopIndexForStartIndex(props, startIndex, scrollTop, instanceProps) {
    var rowCount = props.rowCount,
        height = props.height;


    var itemMetadata = getItemMetadata('row', props, startIndex, instanceProps);
    var maxOffset = scrollTop + height;

    var offset = itemMetadata.offset + itemMetadata.size;
    var stopIndex = startIndex;

    while (stopIndex < rowCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata('row', props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps: function initInstanceProps(props, instance) {
    var _this = this;

    var _ref5 = props,
        estimatedColumnWidth = _ref5.estimatedColumnWidth,
        estimatedRowHeight = _ref5.estimatedRowHeight;


    var instanceProps = {
      columnMetadataMap: {},
      estimatedColumnWidth: estimatedColumnWidth || DEFAULT_ESTIMATED_ITEM_SIZE,
      estimatedRowHeight: estimatedRowHeight || DEFAULT_ESTIMATED_ITEM_SIZE,
      lastMeasuredColumnIndex: -1,
      lastMeasuredRowIndex: -1,
      rowMetadataMap: {}
    };

    instance.resetAfterColumnIndex = function (columnIndex) {
      var shouldForceUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _this.resetAfterIndices({ columnIndex: columnIndex, shouldForceUpdate: shouldForceUpdate });
    };

    instance.resetAfterRowIndex = function (rowIndex) {
      var shouldForceUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _this.resetAfterIndices({ rowIndex: rowIndex, shouldForceUpdate: shouldForceUpdate });
    };

    instance.resetAfterIndices = function (_ref6) {
      var columnIndex = _ref6.columnIndex,
          rowIndex = _ref6.rowIndex,
          _ref6$shouldForceUpda = _ref6.shouldForceUpdate,
          shouldForceUpdate = _ref6$shouldForceUpda === undefined ? true : _ref6$shouldForceUpda;

      if (typeof columnIndex === 'number') {
        instanceProps.lastMeasuredColumnIndex = Math.min(instanceProps.lastMeasuredColumnIndex, columnIndex - 1);
      }
      if (typeof rowIndex === 'number') {
        instanceProps.lastMeasuredRowIndex = Math.min(instanceProps.lastMeasuredRowIndex, rowIndex - 1);
      }

      // We could potentially optimize further by only evicting styles after this index,
      // But since styles are only cached while scrolling is in progress-
      // It seems an unnecessary optimization.
      // It's unlikely that resetAfterIndex() will be called while a user is scrolling.
      instance._getItemStyleCache(-1);

      if (shouldForceUpdate) {
        instance.forceUpdate();
      }
    };

    return instanceProps;
  },


  shouldResetStyleCacheOnItemSizeChange: false,

  validateProps: function validateProps(_ref7) {
    var columnWidth = _ref7.columnWidth,
        rowHeight = _ref7.rowHeight;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof columnWidth !== 'function') {
        throw Error('An invalid "columnWidth" prop has been specified. ' + 'Value should be a function. ' + ('"' + (columnWidth === null ? 'null' : typeof columnWidth === 'undefined' ? 'undefined' : _typeof(columnWidth)) + '" was specified.'));
      } else if (typeof rowHeight !== 'function') {
        throw Error('An invalid "rowHeight" prop has been specified. ' + 'Value should be a function. ' + ('"' + (rowHeight === null ? 'null' : typeof rowHeight === 'undefined' ? 'undefined' : _typeof(rowHeight)) + '" was specified.'));
      }
    }
  }
});

var IS_SCROLLING_DEBOUNCE_INTERVAL$1 = 150;

var defaultItemKey$1 = function defaultItemKey(index) {
  return index;
};

function createListComponent(_ref) {
  var _class, _temp;

  var getItemOffset = _ref.getItemOffset,
      getEstimatedTotalSize = _ref.getEstimatedTotalSize,
      getItemSize = _ref.getItemSize,
      getOffsetForIndexAndAlignment = _ref.getOffsetForIndexAndAlignment,
      getStartIndexForOffset = _ref.getStartIndexForOffset,
      getStopIndexForStartIndex = _ref.getStopIndexForStartIndex,
      initInstanceProps = _ref.initInstanceProps,
      shouldResetStyleCacheOnItemSizeChange = _ref.shouldResetStyleCacheOnItemSizeChange,
      validateProps = _ref.validateProps;

  return _temp = _class = function (_PureComponent) {
    inherits(List, _PureComponent);

    // Always use explicit constructor for React components.
    // It produces less code after transpilation. (#26)
    // eslint-disable-next-line no-useless-constructor
    function List(props) {
      classCallCheck(this, List);

      var _this = possibleConstructorReturn(this, _PureComponent.call(this, props));

      _this._instanceProps = initInstanceProps(_this.props, _this);
      _this._resetIsScrollingTimeoutId = null;
      _this.state = {
        isScrolling: false,
        scrollDirection: 'forward',
        scrollOffset: typeof _this.props.initialScrollOffset === 'number' ? _this.props.initialScrollOffset : 0,
        scrollUpdateWasRequested: false
      };
      _this._callOnItemsRendered = memoizeOne(function (overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) {
        return _this.props.onItemsRendered({
          overscanStartIndex: overscanStartIndex,
          overscanStopIndex: overscanStopIndex,
          visibleStartIndex: visibleStartIndex,
          visibleStopIndex: visibleStopIndex
        });
      });
      _this._callOnScroll = memoizeOne(function (scrollDirection, scrollOffset, scrollUpdateWasRequested) {
        return _this.props.onScroll({
          scrollDirection: scrollDirection,
          scrollOffset: scrollOffset,
          scrollUpdateWasRequested: scrollUpdateWasRequested
        });
      });

      _this._getItemStyle = function (index) {
        var _this$props = _this.props,
            direction = _this$props.direction,
            itemSize = _this$props.itemSize;


        var itemStyleCache = _this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize);

        var style = void 0;
        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index];
        } else {
          itemStyleCache[index] = style = {
            position: 'absolute',
            left: direction === 'horizontal' ? getItemOffset(_this.props, index, _this._instanceProps) : 0,
            top: direction === 'vertical' ? getItemOffset(_this.props, index, _this._instanceProps) : 0,
            height: direction === 'vertical' ? getItemSize(_this.props, index, _this._instanceProps) : '100%',
            width: direction === 'horizontal' ? getItemSize(_this.props, index, _this._instanceProps) : '100%'
          };
        }

        return style;
      };

      _this._getItemStyleCache = memoizeOne(function (_) {
        return {};
      });

      _this._onScrollHorizontal = function (event) {
        var scrollLeft = event.currentTarget.scrollLeft;

        _this.setState(function (prevState) {
          if (prevState.scrollOffset === scrollLeft) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null;
          }

          return {
            isScrolling: true,
            scrollDirection: prevState.scrollOffset < scrollLeft ? 'forward' : 'backward',
            scrollOffset: scrollLeft,
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };

      _this._onScrollVertical = function (event) {
        var scrollTop = event.currentTarget.scrollTop;

        _this.setState(function (prevState) {
          if (prevState.scrollOffset === scrollTop) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null;
          }

          return {
            isScrolling: true,
            scrollDirection: prevState.scrollOffset < scrollTop ? 'forward' : 'backward',
            scrollOffset: scrollTop,
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };

      _this._outerRefSetter = function (ref) {
        var outerRef = _this.props.outerRef;


        _this._outerRef = ref;

        if (typeof outerRef === 'function') {
          outerRef(ref);
        } else if (outerRef != null && (typeof outerRef === 'undefined' ? 'undefined' : _typeof(outerRef)) === 'object' && outerRef.hasOwnProperty('current')) {
          outerRef.current = ref;
        }
      };

      _this._resetIsScrollingDebounced = function () {
        if (_this._resetIsScrollingTimeoutId !== null) {
          clearTimeout(_this._resetIsScrollingTimeoutId);
        }

        _this._resetIsScrollingTimeoutId = setTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL$1);
      };

      _this._resetIsScrolling = function () {
        _this._resetIsScrollingTimeoutId = null;

        _this.setState({ isScrolling: false }, function () {
          // Clear style cache after state update has been committed.
          // This way we don't break pure sCU for items that don't use isScrolling param.
          _this._getItemStyleCache(-1);
        });
      };

      return _this;
    }

    List.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
      validateSharedProps$1(props);
      validateProps(props);
      return null;
    };

    List.prototype.scrollTo = function scrollTo(scrollOffset) {
      this.setState(function (prevState) {
        return {
          scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
          scrollOffset: scrollOffset,
          scrollUpdateWasRequested: true
        };
      }, this._resetIsScrollingDebounced);
    };

    List.prototype.scrollToItem = function scrollToItem(index) {
      var align = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
      var scrollOffset = this.state.scrollOffset;

      this.scrollTo(getOffsetForIndexAndAlignment(this.props, index, align, scrollOffset, this._instanceProps));
    };

    List.prototype.componentDidMount = function componentDidMount() {
      var _props = this.props,
          initialScrollOffset = _props.initialScrollOffset,
          direction = _props.direction;


      if (typeof initialScrollOffset === 'number' && this._outerRef !== null) {
        if (direction === 'horizontal') {
          this._outerRef.scrollLeft = initialScrollOffset;
        } else {
          this._outerRef.scrollTop = initialScrollOffset;
        }
      }

      this._callPropsCallbacks();
    };

    List.prototype.componentDidUpdate = function componentDidUpdate() {
      var direction = this.props.direction;
      var _state = this.state,
          scrollOffset = _state.scrollOffset,
          scrollUpdateWasRequested = _state.scrollUpdateWasRequested;


      if (scrollUpdateWasRequested && this._outerRef !== null) {
        if (direction === 'horizontal') {
          this._outerRef.scrollLeft = scrollOffset;
        } else {
          this._outerRef.scrollTop = scrollOffset;
        }
      }

      this._callPropsCallbacks();
    };

    List.prototype.componentWillUnmount = function componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }
    };

    List.prototype.render = function render() {
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          direction = _props2.direction,
          height = _props2.height,
          innerRef = _props2.innerRef,
          innerTagName = _props2.innerTagName,
          itemCount = _props2.itemCount,
          itemData = _props2.itemData,
          _props2$itemKey = _props2.itemKey,
          itemKey = _props2$itemKey === undefined ? defaultItemKey$1 : _props2$itemKey,
          outerTagName = _props2.outerTagName,
          style = _props2.style,
          useIsScrolling = _props2.useIsScrolling,
          width = _props2.width;
      var isScrolling = this.state.isScrolling;


      var onScroll = direction === 'vertical' ? this._onScrollVertical : this._onScrollHorizontal;

      var _getRangeToRender2 = this._getRangeToRender(),
          startIndex = _getRangeToRender2[0],
          stopIndex = _getRangeToRender2[1];

      var items = [];
      if (itemCount > 0) {
        for (var _index = startIndex; _index <= stopIndex; _index++) {
          items.push(React.createElement(children, {
            data: itemData,
            key: itemKey(_index),
            index: _index,
            isScrolling: useIsScrolling ? isScrolling : undefined,
            style: this._getItemStyle(_index)
          }));
        }
      }

      // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.
      var estimatedTotalSize = getEstimatedTotalSize(this.props, this._instanceProps);

      return React.createElement(outerTagName, {
        className: className,
        onScroll: onScroll,
        ref: this._outerRefSetter,
        style: _extends({
          position: 'relative',
          height: height,
          width: width,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform'
        }, style)
      }, React.createElement(innerTagName, {
        children: items,
        ref: innerRef,
        style: {
          height: direction === 'horizontal' ? '100%' : estimatedTotalSize,
          overflow: 'hidden',
          pointerEvents: isScrolling ? 'none' : '',
          width: direction === 'horizontal' ? estimatedTotalSize : '100%'
        }
      }));
    };

    List.prototype._callPropsCallbacks = function _callPropsCallbacks() {
      if (typeof this.props.onItemsRendered === 'function') {
        var _itemCount = this.props.itemCount;

        if (_itemCount > 0) {
          var _getRangeToRender3 = this._getRangeToRender(),
              _overscanStartIndex = _getRangeToRender3[0],
              _overscanStopIndex = _getRangeToRender3[1],
              _visibleStartIndex = _getRangeToRender3[2],
              _visibleStopIndex = _getRangeToRender3[3];

          this._callOnItemsRendered(_overscanStartIndex, _overscanStopIndex, _visibleStartIndex, _visibleStopIndex);
        }
      }

      if (typeof this.props.onScroll === 'function') {
        var _state2 = this.state,
            _scrollDirection = _state2.scrollDirection,
            _scrollOffset = _state2.scrollOffset,
            _scrollUpdateWasRequested = _state2.scrollUpdateWasRequested;

        this._callOnScroll(_scrollDirection, _scrollOffset, _scrollUpdateWasRequested);
      }
    };

    // Lazily create and cache item styles while scrolling,
    // So that pure component sCU will prevent re-renders.
    // We maintain this cache, and pass a style prop rather than index,
    // So that List can clear cached styles and force item re-render if necessary.


    List.prototype._getRangeToRender = function _getRangeToRender() {
      var _props3 = this.props,
          itemCount = _props3.itemCount,
          overscanCount = _props3.overscanCount;
      var _state3 = this.state,
          scrollDirection = _state3.scrollDirection,
          scrollOffset = _state3.scrollOffset;


      var startIndex = getStartIndexForOffset(this.props, scrollOffset, this._instanceProps);
      var stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this._instanceProps);

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
      var overscanBackward = scrollDirection === 'backward' ? Math.max(1, overscanCount) : 1;
      var overscanForward = scrollDirection === 'forward' ? Math.max(1, overscanCount) : 1;

      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };

    return List;
  }(React.PureComponent), _class.defaultProps = {
    direction: 'vertical',
    innerTagName: 'div',
    outerTagName: 'div',
    overscanCount: 2,
    useIsScrolling: false
  }, _temp;
}

// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.

var validateSharedProps$1 = function validateSharedProps(_ref2) {
  var children = _ref2.children,
      direction = _ref2.direction,
      height = _ref2.height,
      width = _ref2.width;

  if (process.env.NODE_ENV !== 'production') {
    if (direction !== 'horizontal' && direction !== 'vertical') {
      throw Error('An invalid "direction" prop has been specified. ' + 'Value should be either "horizontal" or "vertical". ' + ('"' + direction + '" was specified.'));
    }

    if (typeof children !== 'function') {
      throw Error('An invalid "children" prop has been specified. ' + 'Value should be a function that creates a React element. ' + ('"' + (children === null ? 'null' : typeof children === 'undefined' ? 'undefined' : _typeof(children)) + '" was specified.'));
    }

    if (direction === 'horizontal' && typeof width !== 'number') {
      throw Error('An invalid "width" prop has been specified. ' + 'Horizontal lists must specify a number for width. ' + ('"' + (width === null ? 'null' : typeof width === 'undefined' ? 'undefined' : _typeof(width)) + '" was specified.'));
    } else if (direction === 'vertical' && typeof height !== 'number') {
      throw Error('An invalid "height" prop has been specified. ' + 'Vertical lists must specify a number for height. ' + ('"' + (height === null ? 'null' : typeof height === 'undefined' ? 'undefined' : _typeof(height)) + '" was specified.'));
    }
  }
};

var DEFAULT_ESTIMATED_ITEM_SIZE$1 = 50;

var getItemMetadata$1 = function getItemMetadata(props, index, instanceProps) {
  var _ref = props,
      itemSize = _ref.itemSize;
  var itemMetadataMap = instanceProps.itemMetadataMap,
      lastMeasuredIndex = instanceProps.lastMeasuredIndex;


  if (index > lastMeasuredIndex) {
    var _offset = 0;
    if (lastMeasuredIndex >= 0) {
      var itemMetadata = itemMetadataMap[lastMeasuredIndex];
      _offset = itemMetadata.offset + itemMetadata.size;
    }

    for (var i = lastMeasuredIndex + 1; i <= index; i++) {
      var _size = itemSize(i);

      itemMetadataMap[i] = {
        offset: _offset,
        size: _size
      };

      _offset += _size;
    }

    instanceProps.lastMeasuredIndex = index;
  }

  return itemMetadataMap[index];
};

var findNearestItem$1 = function findNearestItem(props, instanceProps, offset) {
  var itemMetadataMap = instanceProps.itemMetadataMap,
      lastMeasuredIndex = instanceProps.lastMeasuredIndex;


  var lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;

  if (lastMeasuredItemOffset >= offset) {
    // If we've already measured items within this range just use a binary search as it's faster.
    return findNearestItemBinarySearch$1(props, instanceProps, lastMeasuredIndex, 0, offset);
  } else {
    // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    // The overall complexity for this approach is O(log n).
    return findNearestItemExponentialSearch$1(props, instanceProps, Math.max(0, lastMeasuredIndex), offset);
  }
};

var findNearestItemBinarySearch$1 = function findNearestItemBinarySearch(props, instanceProps, high, low, offset) {
  while (low <= high) {
    var middle = low + Math.floor((high - low) / 2);
    var currentOffset = getItemMetadata$1(props, middle, instanceProps).offset;

    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};

var findNearestItemExponentialSearch$1 = function findNearestItemExponentialSearch(props, instanceProps, index, offset) {
  var itemCount = props.itemCount;

  var interval = 1;

  while (index < itemCount && getItemMetadata$1(props, index, instanceProps).offset < offset) {
    index += interval;
    interval *= 2;
  }

  return findNearestItemBinarySearch$1(props, instanceProps, Math.min(index, itemCount - 1), Math.floor(index / 2), offset);
};

var getEstimatedTotalSize = function getEstimatedTotalSize(_ref2, _ref3) {
  var itemCount = _ref2.itemCount;
  var itemMetadataMap = _ref3.itemMetadataMap,
      estimatedItemSize = _ref3.estimatedItemSize,
      lastMeasuredIndex = _ref3.lastMeasuredIndex;

  var totalSizeOfMeasuredItems = 0;

  if (lastMeasuredIndex >= 0) {
    var itemMetadata = itemMetadataMap[lastMeasuredIndex];
    totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size;
  }

  var numUnmeasuredItems = itemCount - lastMeasuredIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize;

  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
};

var VariableSizeList = /*#__PURE__*/createListComponent({
  getItemOffset: function getItemOffset(props, index, instanceProps) {
    return getItemMetadata$1(props, index, instanceProps).offset;
  },

  getItemSize: function getItemSize(props, index, instanceProps) {
    return instanceProps.itemMetadataMap[index].size;
  },

  getEstimatedTotalSize: getEstimatedTotalSize,

  getOffsetForIndexAndAlignment: function getOffsetForIndexAndAlignment(props, index, align, scrollOffset, instanceProps) {
    var direction = props.direction,
        height = props.height,
        width = props.width;


    var size = direction === 'horizontal' ? width : height;
    var itemMetadata = getItemMetadata$1(props, index, instanceProps);

    // Get estimated total size after ItemMetadata is computed,
    // To ensure it reflects actual measurements instead of just estimates.
    var estimatedTotalSize = getEstimatedTotalSize(props, instanceProps);

    var maxOffset = Math.min(estimatedTotalSize - size, itemMetadata.offset);
    var minOffset = Math.max(0, itemMetadata.offset - size + itemMetadata.size);

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getStartIndexForOffset: function getStartIndexForOffset(props, offset, instanceProps) {
    return findNearestItem$1(props, instanceProps, offset);
  },

  getStopIndexForStartIndex: function getStopIndexForStartIndex(props, startIndex, scrollOffset, instanceProps) {
    var direction = props.direction,
        height = props.height,
        itemCount = props.itemCount,
        width = props.width;


    var size = direction === 'horizontal' ? width : height;
    var itemMetadata = getItemMetadata$1(props, startIndex, instanceProps);
    var maxOffset = scrollOffset + size;

    var offset = itemMetadata.offset + itemMetadata.size;
    var stopIndex = startIndex;

    while (stopIndex < itemCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata$1(props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps: function initInstanceProps(props, instance) {
    var _ref4 = props,
        estimatedItemSize = _ref4.estimatedItemSize;


    var instanceProps = {
      itemMetadataMap: {},
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE$1,
      lastMeasuredIndex: -1
    };

    instance.resetAfterIndex = function (index) {
      var shouldForceUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      instanceProps.lastMeasuredIndex = Math.min(instanceProps.lastMeasuredIndex, index - 1);

      // We could potentially optimize further by only evicting styles after this index,
      // But since styles are only cached while scrolling is in progress-
      // It seems an unnecessary optimization.
      // It's unlikely that resetAfterIndex() will be called while a user is scrolling.
      instance._getItemStyleCache(-1);

      if (shouldForceUpdate) {
        instance.forceUpdate();
      }
    };

    return instanceProps;
  },


  shouldResetStyleCacheOnItemSizeChange: false,

  validateProps: function validateProps(_ref5) {
    var itemSize = _ref5.itemSize;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'function') {
        throw Error('An invalid "itemSize" prop has been specified. ' + 'Value should be a function. ' + ('"' + (itemSize === null ? 'null' : typeof itemSize === 'undefined' ? 'undefined' : _typeof(itemSize)) + '" was specified.'));
      }
    }
  }
});

var FixedSizeGrid = /*#__PURE__*/createGridComponent({
  getColumnOffset: function getColumnOffset(_ref, index) {
    var columnWidth = _ref.columnWidth;
    return index * columnWidth;
  },

  getColumnWidth: function getColumnWidth(_ref2, index) {
    var columnWidth = _ref2.columnWidth;
    return columnWidth;
  },

  getRowOffset: function getRowOffset(_ref3, index) {
    var rowHeight = _ref3.rowHeight;
    return index * rowHeight;
  },

  getRowHeight: function getRowHeight(_ref4, index) {
    var rowHeight = _ref4.rowHeight;
    return rowHeight;
  },

  getEstimatedTotalHeight: function getEstimatedTotalHeight(_ref5) {
    var rowCount = _ref5.rowCount,
        rowHeight = _ref5.rowHeight;
    return rowHeight * rowCount;
  },

  getEstimatedTotalWidth: function getEstimatedTotalWidth(_ref6) {
    var columnCount = _ref6.columnCount,
        columnWidth = _ref6.columnWidth;
    return columnWidth * columnCount;
  },

  getOffsetForColumnAndAlignment: function getOffsetForColumnAndAlignment(_ref7, columnIndex, align, scrollLeft) {
    var columnCount = _ref7.columnCount,
        columnWidth = _ref7.columnWidth,
        width = _ref7.width;

    var maxOffset = Math.min(columnCount * columnWidth - width, columnIndex * columnWidth);
    var minOffset = Math.max(0, columnIndex * columnWidth - width + columnWidth);

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case 'auto':
      default:
        if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
          return scrollLeft;
        } else if (scrollLeft - minOffset < maxOffset - scrollLeft) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getOffsetForRowAndAlignment: function getOffsetForRowAndAlignment(_ref8, rowIndex, align, scrollTop) {
    var rowHeight = _ref8.rowHeight,
        height = _ref8.height,
        rowCount = _ref8.rowCount;

    var maxOffset = Math.min(rowCount * rowHeight - height, rowIndex * rowHeight);
    var minOffset = Math.max(0, rowIndex * rowHeight - height + rowHeight);

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case 'auto':
      default:
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          return scrollTop;
        } else if (scrollTop - minOffset < maxOffset - scrollTop) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getColumnStartIndexForOffset: function getColumnStartIndexForOffset(_ref9, scrollLeft) {
    var columnWidth = _ref9.columnWidth,
        columnCount = _ref9.columnCount;
    return Math.max(0, Math.min(columnCount - 1, Math.floor(scrollLeft / columnWidth)));
  },

  getColumnStopIndexForStartIndex: function getColumnStopIndexForStartIndex(_ref10, startIndex, scrollLeft) {
    var columnWidth = _ref10.columnWidth,
        columnCount = _ref10.columnCount,
        width = _ref10.width;

    var left = startIndex * columnWidth;
    return Math.max(0, Math.min(columnCount - 1, startIndex + Math.floor((width + (scrollLeft - left)) / columnWidth)));
  },

  getRowStartIndexForOffset: function getRowStartIndexForOffset(_ref11, scrollTop) {
    var rowHeight = _ref11.rowHeight,
        rowCount = _ref11.rowCount;
    return Math.max(0, Math.min(rowCount - 1, Math.floor(scrollTop / rowHeight)));
  },

  getRowStopIndexForStartIndex: function getRowStopIndexForStartIndex(_ref12, startIndex, scrollTop) {
    var rowHeight = _ref12.rowHeight,
        rowCount = _ref12.rowCount,
        height = _ref12.height;

    var left = startIndex * rowHeight;
    return Math.max(0, Math.min(rowCount - 1, startIndex + Math.floor((height + (scrollTop - left)) / rowHeight)));
  },

  initInstanceProps: function initInstanceProps(props) {
    // Noop
  },


  shouldResetStyleCacheOnItemSizeChange: true,

  validateProps: function validateProps(_ref13) {
    var columnWidth = _ref13.columnWidth,
        rowHeight = _ref13.rowHeight;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof columnWidth !== 'number') {
        throw Error('An invalid "columnWidth" prop has been specified. ' + 'Value should be a number. ' + ('"' + (columnWidth === null ? 'null' : typeof columnWidth === 'undefined' ? 'undefined' : _typeof(columnWidth)) + '" was specified.'));
      }

      if (typeof rowHeight !== 'number') {
        throw Error('An invalid "rowHeight" prop has been specified. ' + 'Value should be a number. ' + ('"' + (rowHeight === null ? 'null' : typeof rowHeight === 'undefined' ? 'undefined' : _typeof(rowHeight)) + '" was specified.'));
      }
    }
  }
});

var FixedSizeList = /*#__PURE__*/createListComponent({
  getItemOffset: function getItemOffset(_ref, index) {
    var itemSize = _ref.itemSize,
        size = _ref.size;
    return index * itemSize;
  },

  getItemSize: function getItemSize(_ref2, index) {
    var itemSize = _ref2.itemSize,
        size = _ref2.size;
    return itemSize;
  },

  getEstimatedTotalSize: function getEstimatedTotalSize(_ref3) {
    var itemCount = _ref3.itemCount,
        itemSize = _ref3.itemSize;
    return itemSize * itemCount;
  },

  getOffsetForIndexAndAlignment: function getOffsetForIndexAndAlignment(_ref4, index, align, scrollOffset) {
    var direction = _ref4.direction,
        height = _ref4.height,
        itemCount = _ref4.itemCount,
        itemSize = _ref4.itemSize,
        width = _ref4.width;

    var size = direction === 'horizontal' ? width : height;
    var maxOffset = Math.min(itemCount * itemSize - size, index * itemSize);
    var minOffset = Math.max(0, index * itemSize - size + itemSize);

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getStartIndexForOffset: function getStartIndexForOffset(_ref5, offset) {
    var itemCount = _ref5.itemCount,
        itemSize = _ref5.itemSize;
    return Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize)));
  },

  getStopIndexForStartIndex: function getStopIndexForStartIndex(_ref6, startIndex, scrollOffset) {
    var direction = _ref6.direction,
        height = _ref6.height,
        itemCount = _ref6.itemCount,
        itemSize = _ref6.itemSize,
        width = _ref6.width;

    var offset = startIndex * itemSize;
    var size = direction === 'horizontal' ? width : height;
    return Math.max(0, Math.min(itemCount - 1, startIndex + Math.floor((size + (scrollOffset - offset)) / itemSize)));
  },

  initInstanceProps: function initInstanceProps(props) {
    // Noop
  },


  shouldResetStyleCacheOnItemSizeChange: true,

  validateProps: function validateProps(_ref7) {
    var itemSize = _ref7.itemSize;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'number') {
        throw Error('An invalid "itemSize" prop has been specified. ' + 'Value should be a number. ' + ('"' + (itemSize === null ? 'null' : typeof itemSize === 'undefined' ? 'undefined' : _typeof(itemSize)) + '" was specified.'));
      }
    }
  }
});

var classCallCheck$1 = function (instance, Constructor) {
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

var _extends$1 = Object.assign || function (target) {
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

var inherits$1 = function (subClass, superClass) {
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

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn$1 = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function defaultEasing(delta) {
  return delta;
}

var AnimatedList = function (_Component) {
  inherits$1(AnimatedList, _Component);

  function AnimatedList() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck$1(this, AnimatedList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn$1(this, (_ref = AnimatedList.__proto__ || Object.getPrototypeOf(AnimatedList)).call.apply(_ref, [this].concat(args))), _this), _this.listRef = React.createRef(), _this._scrollOffsetInitial = 0, _this._scrollOffsetFinal = 0, _this.onScroll = function (_ref2) {
      var scrollOffset = _ref2.scrollOffset,
          scrollUpdateWasRequested = _ref2.scrollUpdateWasRequested,
          scrollDirection = _ref2.scrollDirection;

      if (!scrollUpdateWasRequested) {
        _this._scrollOffsetInitial = scrollOffset;
      }
    }, _temp), possibleConstructorReturn$1(_this, _ret);
  }

  createClass(AnimatedList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.scrollToItem) {
        this._initAnimation();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.scrollToItem !== prevProps.scrollToItem) {
        this._initAnimation();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React__default.createElement(FixedSizeList, _extends$1({}, this.props, { onScroll: this.onScroll, ref: this.listRef }));
    }
  }, {
    key: "_animate",
    value: function _animate() {
      var _this2 = this;

      requestAnimationFrame(function () {
        var _props = _this2.props,
            duration = _props.duration,
            easing = _props.easing;

        var now = performance.now();
        var ellapsed = now - _this2._animationStartTime;
        var scrollDelta = _this2._scrollOffsetFinal - _this2._scrollOffsetInitial;
        var easedTime = easing(Math.min(1, ellapsed / duration));
        var scrollOffset = _this2._scrollOffsetInitial + scrollDelta * easedTime;

        _this2.listRef.current.scrollTo(scrollOffset);

        if (ellapsed < duration) {
          _this2._animate();
        } else {
          _this2._animationStartTime = undefined;
          _this2._scrollOffsetInitial = _this2._scrollOffsetFinal;
          _this2.props.onAnimationComplete();
        }
      });
    }
  }, {
    key: "_initAnimation",
    value: function _initAnimation() {
      if (this._animationStartTime) {
        console.log("Animation in progress");
        return;
        // throw Error("Animation in progress"); // You handle this however you want.
      }

      var _props2 = this.props,
          itemSize = _props2.itemSize,
          scrollToItem = _props2.scrollToItem;


      this._scrollOffsetFinal = scrollToItem * itemSize;
      this._animationStartTime = performance.now();
      this._animate();
    }
  }]);
  return AnimatedList;
}(React.Component);

AnimatedList.defaultProps = {
  duration: 1000,
  easing: defaultEasing,
  onAnimationComplete: function onAnimationComplete() {}
};

var ItemRenderer = function (_React$PureComponent) {
  inherits$1(ItemRenderer, _React$PureComponent);

  function ItemRenderer() {
    classCallCheck$1(this, ItemRenderer);
    return possibleConstructorReturn$1(this, (ItemRenderer.__proto__ || Object.getPrototypeOf(ItemRenderer)).apply(this, arguments));
  }

  createClass(ItemRenderer, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          data = _props.data,
          key = _props.index,
          style = _props.style;
      var _data$key = data[key],
          child = _data$key.child,
          childStyles = _data$key.childStyles,
          childRef = _data$key.childRef,
          _onMouseEnter = _data$key.onMouseEnter,
          _onMouseLeave = _data$key.onMouseLeave,
          diffHeight = _data$key.diffHeight,
          diffWidth = _data$key.diffWidth;

      var itemStyle = {
        top: diffHeight / 2 + "px",
        left: style.left + diffWidth / 2 + "px"
      };
      return React__default.createElement(
        "div",
        {
          style: _extends$1({}, childStyles, style, itemStyle),
          ref: childRef,
          "data-key": key,
          onMouseEnter: function onMouseEnter() {
            return _onMouseEnter(key);
          },
          onMouseLeave: function onMouseLeave() {
            return _onMouseLeave(key);
          }
        },
        child
      );
    }
  }]);
  return ItemRenderer;
}(React__default.PureComponent);

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

var childHoverVals = function childHoverVals(scale) {
  return {
    transform: "scaleX(" + scale + ") scaleY(1.1)"
  };
};

var childBeforeHoverVals = function childBeforeHoverVals(diff) {
  return {
    transform: "translateX(-" + diff + "px)"
  };
};
var childAfterHoverVals = function childAfterHoverVals(diff) {
  return {
    transform: "translateX(" + diff + "px)"
  };
};

var getChildStyles = function getChildStyles(hoveredItem, key, scale, diffWidth) {
  var childStyles = {};
  if (hoveredItem >= 0) {
    if (key == hoveredItem) {
      childStyles = childHoverVals(scale);
    }
    if (key < hoveredItem) {
      childStyles = childBeforeHoverVals(diffWidth / 2);
    }
    if (key > hoveredItem) {
      childStyles = childAfterHoverVals(diffWidth / 2);
    }
  }
  childStyles = _extends$1({}, childStyles, {
    transition: "transform 500ms",
    cursor: "pointer"
  });

  return childStyles;
};

var Carousel = function (_React$Component) {
  inherits$1(Carousel, _React$Component);

  function Carousel(props) {
    classCallCheck$1(this, Carousel);

    var _this = possibleConstructorReturn$1(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

    _this.reactChildren = [];
    _this.element = null;
    _this.pages = null;
    _this.pageItems = 0;
    _this.count = null;
    _this.lastPage = null;
    _this.state = {
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

    _this.getRef = function (element) {
      _this.element = element;
    };

    _this.onMouseEnter = function (key) {
      _this.setState({
        hoveredItem: key
      });
    };

    _this.onMouseLeave = function () {
      _this.setState({
        hoveredItem: -1
      });
    };

    _this.progress = function (pageNo) {
      _this.setState({
        currentPage: pageNo
      });
    };

    _this.prev = function () {
      _this.setState(function (_ref) {
        var currentPage = _ref.currentPage;

        if (1 < currentPage && currentPage <= _this.pages) {
          return { currentPage: currentPage - 1 };
        } else return { currentPage: currentPage };
      });
    };

    _this.next = function () {
      _this.setState(function (_ref2) {
        var currentPage = _ref2.currentPage;

        if (1 <= currentPage && currentPage < _this.pages) {
          return { currentPage: currentPage + 1 };
        } else return { currentPage: currentPage };
      });
    };

    _this.reactChildren = React__default.Children.toArray(props.children);
    _this.count = React__default.Children.count(props.children);
    if (props.slidesToScroll) {
      _this.pageItems = props.slidesToScroll;
    }
    return _this;
  }

  createClass(Carousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.element) {
        var dimensions = this.element.getBoundingClientRect();
        var parentDimensions = this.element.parentElement.getBoundingClientRect();

        var width = dimensions.width || 200;
        var parentWidth = parentDimensions.width;
        var scaledWidth = width * this.props.scale;
        var fullWidth = scaledWidth * this.count;

        var height = dimensions.height;
        var scaledHeight = height * 1.1;
        var diffHeight = scaledHeight - height;
        this.lastPage = Math.floor(parentWidth / scaledWidth);
        if (!this.pageItems) this.pageItems = Math.abs((this.count - this.lastPage) / 2);
        if (fullWidth > parentWidth) {
          this.showCarousel = true;
          this.pages = Math.ceil((this.count - this.lastPage) / this.pageItems + 1);
        }
        this.setState({
          height: height,
          width: width,
          scaledHeight: scaledHeight,
          scaledWidth: scaledWidth,
          diffWidth: scaledWidth - width,
          diffHeight: diffHeight,
          top: dimensions.top * this.props.scale,
          parentWidth: parentWidth,
          fullWidth: fullWidth
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var onMouseEnter = this.onMouseEnter,
          onMouseLeave = this.onMouseLeave,
          props = this.props,
          state = this.state,
          reactChildren = this.reactChildren,
          getRef = this.getRef,
          prev = this.prev,
          next = this.next,
          pages = this.pages,
          pageItems = this.pageItems,
          showCarousel = this.showCarousel,
          count = this.count;
      var children = props.children,
          renderPrev = props.renderPrev,
          renderNext = props.renderNext,
          renderProgress = props.renderProgress,
          speed = props.speed,
          scale = props.scale;
      var height = state.height,
          scaledHeight = state.scaledHeight,
          scaledWidth = state.scaledWidth,
          parentWidth = state.parentWidth,
          hoveredItem = state.hoveredItem,
          position = state.position,
          currentPage = state.currentPage,
          top = state.top,
          diffWidth = state.diffWidth,
          width = state.width,
          diffHeight = state.diffHeight;


      if (!children || count < 0) {
        return React__default.createElement(
          "div",
          null,
          "Gimme some children"
        );
      }
      if (!height) {
        var firstChild = reactChildren[0];
        return React__default.createElement(
          NodeResolver$1,
          { innerRef: getRef },
          firstChild
        );
      }
      var itemData = reactChildren.map(function (child, key) {
        var childStyles = getChildStyles(hoveredItem, key, scale, diffWidth);
        return {
          child: child,
          childStyles: childStyles,
          key: key,
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
          diffHeight: diffHeight,
          diffWidth: diffWidth
        };
      });
      var prevButtonDisabled = currentPage === 1 || hoveredItem > -1;
      var nextButtonDisabled = currentPage === pages || hoveredItem > -1;
      var pageArray = new Array(pages).fill(1);
      return React__default.createElement(
        React__default.Fragment,
        null,
        showCarousel && pageArray.map(function (item, pageNo) {
          var isEnabled = pageNo === currentPage - 1;
          return React__default.createElement(
            "span",
            {
              style: {
                cursor: "pointer",
                display: "inline-block",
                marginRight: "5px"
              },
              onClick: function onClick() {
                return _this2.progress(pageNo + 1);
              }
            },
            renderProgress({ enabled: isEnabled })
          );
        }),
        showCarousel && React__default.createElement(
          React__default.Fragment,
          null,
          renderPrev({
            disabled: prevButtonDisabled,
            onClick: prev,
            basicStyle: {
              height: scaledHeight,
              top: diffHeight + "px",
              left: 0
            }
          })
        ),
        React__default.createElement(
          AnimatedList,
          {
            itemData: itemData,
            height: scaledHeight,
            itemSize: width + 10,
            direction: "horizontal",
            itemCount: count,
            width: parentWidth,
            style: { overflow: "hidden", margin: diffHeight / 2 + "px 0" },
            scrollToItem: (currentPage - 1) * pageItems,
            duration: speed
          },
          ItemRenderer
        ),
        showCarousel && React__default.createElement(
          React__default.Fragment,
          null,
          renderNext({
            disabled: nextButtonDisabled,
            onClick: next,
            basicStyle: {
              height: scaledHeight,
              right: 0,
              top: diffHeight + "px"
            }
          })
        )
      );
    }
  }]);
  return Carousel;
}(React__default.Component);

Carousel.defaultProps = {
  slidesToScroll: null,
  speed: 10,
  scale: 1.2
};

var prevNextStyle = {
  zIndex: "10"
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
  style = _extends$1({}, style, prevNextStyle);
  return React__default.createElement(
    "button",
    { disabled: disabled, onClick: onClick, style: _extends$1({}, style) },
    "Prev"
  );
};

var NextButton = function NextButton(_ref2) {
  var disabled = _ref2.disabled,
      onClick = _ref2.onClick,
      basicStyle = _ref2.basicStyle;

  var style = disabled ? {} : noHoverStyle;
  style = _extends$1({}, style, prevNextStyle);
  return React__default.createElement(
    "button",
    { disabled: disabled, onClick: onClick, style: _extends$1({}, style) },
    "Next"
  );
};

var ProgressUnit = function ProgressUnit(_ref3) {
  var enabled = _ref3.enabled;

  var normalStyle = {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "gray"
  };
  var enabledStyle = {
    background: "red"
  };
  var style = enabled ? _extends$1({}, normalStyle, enabledStyle) : normalStyle;
  return React__default.createElement("div", { style: style });
};

var index = (function (_ref4) {
  var children = _ref4.children,
      renderPrev = _ref4.renderPrev,
      renderNext = _ref4.renderNext,
      renderProgress = _ref4.renderProgress,
      props = objectWithoutProperties(_ref4, ["children", "renderPrev", "renderNext", "renderProgress"]);
  return React__default.createElement(
    Carousel,
    _extends$1({
      renderPrev: renderPrev || PrevButton,
      renderNext: renderNext || NextButton,
      renderProgress: renderProgress || ProgressUnit
    }, props),
    children
  );
});

module.exports = index;

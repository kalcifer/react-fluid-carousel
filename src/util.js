export const findPrevNextObjs = (findKey, childRefs) => {
  let prevKeyList = [];
  let nextKeyList = [];
  let prevObj;
  let currentObj;
  let nextObj;
  childRefs.forEach(child => {
    if (child.current) {
      if (currentObj && !nextObj) {
        nextObj = child;
        nextKeyList.push(child.current.getAttribute("data-key"));
      } else if (currentObj && nextObj && nextKeyList.length > 0) {
        nextKeyList.push(child.current.getAttribute("data-key"));
      }
      if (child.current.getAttribute("data-key") == findKey) {
        currentObj = child;
      }
      if (prevObj && !currentObj && !nextObj) {
        prevKeyList.push(child.current.getAttribute("data-key"));
      }
      if (!prevObj && !currentObj) {
        prevObj = child;
        prevKeyList.push(prevObj.current.getAttribute("data-key"));
      }
    }
  });
  return [prevKeyList, nextKeyList];
};

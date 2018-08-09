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
  return [prevKeyList, nextKeyList];
};

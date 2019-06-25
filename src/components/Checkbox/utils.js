
export function deepMap (node, result = []) {
  if (Object.prototype.toString.call(node.children) === '[object Array]') {
    node.children.forEach(item => {
      if (item.children) {
        deepMap(item, result);
      } else {
        result.push(item.value);
      }
    })
    return result
  } else {
    return result;
  }
}
export function loop () {}
// 从数组 arr1 里删除 数组 arr2 的子元素
export function deleteByArray (arr1, arr2) {
  const temp = [];
  arr1.map(item => {
    if (arr2.indexOf(item) < 0) { // arr2 里 没有 arr1 的 item
      temp.push(item)
    }
    return item;
  })
  return temp;
}
export function compareArray (arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort())
}
export function parseArr2Obj (arr) {
  const obj = {};
  const options = {
    checked: true,
    indeterminate: false,
  }
  arr.map(i => {
    obj[i] = {
      ...options,
      value: i
    }
    return i;
  })
  return obj;
}

export function checkedAllFn (options, state = true) {
  const obj = {
    checked: state,
    indeterminate: false,
    value: options.value,
  };
  const data = {...obj, children: []};
  if (options.children && state) {
    options.children.forEach(item => {
      data.children.push(checkedAllFn(item));
    });
  }
  return data;
}
export function parseObj2Array (data, arr1, arr2) {
  if (Object.prototype.toString.call(data) === '[object Array]') {
    data.forEach(item => parseObj2Array(item, arr1, arr2));
  } else {
    if (data.checked) { // 勾选
      arr1.push(data.value);
      arr2.push(data.value);
    } else if (data.indeterminate) { // 半选
      arr2.push(data.value);
    } // else 未选
    if (data.children && data.children.length) {
      parseObj2Array(data.children, arr1, arr2);
    }
  }
  return [arr1, arr2];
}
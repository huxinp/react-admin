export const STATUS_ADD = 'add';
export const STATUS_KEEP = 'keep';
export const STATUS_REMOVE = 'remove';
export const STATUS_REMOVED = 'removed';

export function wrapKeyToObject(key) {
  let keyObj = void 0;
  if (key && typeof key === 'object' && 'key' in key) {
    keyObj = key;
  } else {
    keyObj = { key };
  }
  return Object.assign({}, keyObj, {
    key: String(keyObj.key)
  });
}

export function parseKeys() {
  const keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return keys.map(wrapKeyToObject);
}

export function diffKeys() {
  const prevKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const currentKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let list = [];
  let currentIndex = 0;
  const currentLen = currentKeys.length;
  const prevKeyObjects = parseKeys(prevKeys);
  const currentKeyObjects = parseKeys(currentKeys);
  prevKeyObjects.forEach(function(keyObj) {
    let hit = false;
    for (let i = currentIndex; i < currentLen; i++) {
      const currentKeyObj = currentKeyObjects[i];
      if (currentKeyObj.key === keyObj.key) {
        if (currentIndex < i) {
          list = list.concat(currentKeyObjects.slice(currentIndex, i).map(function(obj) {
            return Object.assign({}, obj, { status: STATUS_ADD });
          }))
          currentIndex = i;
        }
        list.push(Object.assign({}, currentKeyObj, { status: STATUS_KEEP }));
        currentIndex += 1;

        hit = true;
        break;
      } 
    }
    if (!hit) {
      list.push(Object.assign({}, keyObj, {
        status: STATUS_REMOVE,
      }));
    }
  });
  if (currentIndex < currentLen) {
    list = list.concat(currentKeyObjects.slice(currentIndex).map(function(obj) {
      return Object.assign({}, obj, { status: STATUS_ADD });
    }));
  }
  const keys = {};
  list.forEach(function(_ref) {
    const key = _ref.key;
    keys[key] = (keys[key] || 0) + 1;
  });
  const duplicatedKeys = Object.keys(keys).filter(function(key) {
    return keys[key] > 1;
  });
  duplicatedKeys.forEach(function(matchKey) {
    // Remove `STATUS_REMOVE` node
    list = list.filter(function(_ref2) {
      const { key, status } = _ref2;
      return key !== matchKey || status !== STATUS_REMOVE;
    })
    // Update `STATUS_ADD` to `STATUS_KEEP`
    list.forEach(function(node) {
      if (node.key === matchKey) {
        node.status = STATUS_KEEP;
      }
    });
  });
  return list;
}

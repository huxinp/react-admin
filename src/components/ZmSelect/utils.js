// import Immutable, { fromJS } from 'immutable';

const autoAdjustOverflow = {
  adjustX: true,
  adjustY: true
};

const targetOffset = [0, 0];

export const placements = {
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
    offset: [0, 5],
    targetOffset: targetOffset
  },
  bottomRight: {
    points: ['tr', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [0, -5],
    targetOffset: targetOffset
  },
  topRight: {
    points: ['br', 'br'],
    overflow: autoAdjustOverflow,
    offset: [0, 5],
    targetOffset: targetOffset
  },
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [0, -5],
    targetOffset: targetOffset
  }
};

export const getSelectPath = (selected, sortArray, customLabel) => {
  const arrayPath = [];
  const selectedKeys = Object.keys(selected.toJS()).sort((a, b) => sortArray.indexOf(a) - sortArray.indexOf(b));
  let textPath;
  selectedKeys.forEach(key => {
    arrayPath.push(selected.getIn([key, customLabel]));
  });
  if (arrayPath.length < 3) {
    textPath = arrayPath.join(' / ');
  } else {
    textPath = [arrayPath[0], '...', arrayPath.slice(-1)[0]].join(' / ');
  }
  return {
    textPath,
    titlePath: arrayPath.join(' / '),
    arrayPath,
  }
}

export function parseOption (option, label, value) {
  const res = {};
  option = option.toJS ? option.toJS() : option;
  if (Object.prototype.toString.call(option) === '[object Object]') {
    res[label] = option[label];
    res[value] = option[value]
  } else {
    res[label] = res[value] = option;
  }
  return res;
}

export function toString (any) {
  return Object.prototype.toString.call(any)
}

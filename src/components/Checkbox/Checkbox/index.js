import React from 'react';
import Checkbox from './Checkbox';
import Group from '../Group';
import '../index.scss';

Checkbox.Group = function (props) {
  return <Group type="checkbox" {...props} />
};
export default Checkbox;
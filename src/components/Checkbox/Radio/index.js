import React from 'react';
import Radio from './Radio';
import Group from '../Group';
import '../index.scss';

Radio.Group = function (props) {
  return <Group type="radio" {...props} />
};
export default Radio;
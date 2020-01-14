import React from 'react';
import message from '@/antd-components/Message';

const info = function() {
  message.info('这是一条普通的题型 without icon');
}

export default function Message() {
  return (
    <button onClick={info}>提示</button>
  )
}
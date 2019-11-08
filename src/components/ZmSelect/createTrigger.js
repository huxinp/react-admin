import React from 'react';
import Trigger from 'rc-trigger';

export default function createTrigger (fireComponent, popupComponent, triggerProps) {
  return (
    <Trigger
      popup={popupComponent}
      popupStyle={{position: 'absolute'}}
      {...triggerProps}
    >
      {fireComponent}
    </Trigger>
  )
}
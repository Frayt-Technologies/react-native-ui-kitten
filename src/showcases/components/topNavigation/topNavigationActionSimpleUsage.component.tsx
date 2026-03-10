import React from 'react';
import { Icon, IconElement, TopNavigationAction } from '@frayt/components';
import { TouchableWebElement } from '@frayt/components/devsupport';

const BackIcon = (props): IconElement => (
  <Icon
    {...props}
    name='arrow-back'
  />
);

export const TopNavigationActionSimpleUsageShowcase = (): TouchableWebElement => (
  <TopNavigationAction icon={BackIcon} />
);

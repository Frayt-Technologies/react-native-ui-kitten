import React from 'react';
import { CircularProgressBar } from '@frayt/components';
import { useProgress } from '../../helpers/progress.hook';

export const CircularProgressBarSimpleUsageShowcase = (): React.ReactElement => {
  const progress = useProgress();
  return (
    <CircularProgressBar progress={progress} />
  );
};

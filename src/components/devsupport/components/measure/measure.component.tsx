/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  findNodeHandle,
  UIManager,
  StatusBar,
} from 'react-native';
import { Frame } from './type';

export interface MeasureElementProps {
  force?: boolean;
  shouldUseTopInsets?: boolean;
  onMeasure: (frame: Frame) => void;
  children: React.ReactElement;
}

export type MeasuringElement = React.ReactElement;
type MeasureInWindowCallback = (x: number, y: number, w: number, h: number) => void;
type MeasurableNode = React.Component<unknown, unknown> & {
  measureInWindow?: (callback: MeasureInWindowCallback) => void;
};
/**
 * Measures child element size and it's screen position asynchronously.
 * Returns measure result in `onMeasure` callback.
 *
 * Usage:
 *
 * ```tsx
 * const onMeasure = (frame: Frame): void => {
 *   const { x, y } = frame.origin;
 *   const { width, height } = frame.size;
 *   ...
 * };
 *
 * <MeasureElement
 *   shouldUseTopInsets={ModalService.getShouldUseTopInsets}
 *   onMeasure={onMeasure}>
 *   <ElementToMeasure />
 * </MeasureElement>
 * ```
 *
 * By default, it measures each time onLayout is called,
 * but `force` property may be used to measure any time it's needed.
 * DON'T USE THIS FLAG IF THE COMPONENT RENDERS FIRST TIME OR YOU KNOW `onLayout` WILL BE CALLED.
 */
export const MeasureElement: React.FC<MeasureElementProps> = (props): MeasuringElement => {

  const nodeRef = React.useRef<MeasurableNode | null>(null);

  const bindToWindow = (frame: Frame, window: Frame): Frame => {
    const originX = frame.origin.x;
    const windowWidth = window.size.width;

    if (!Number.isFinite(originX) ||
      !Number.isFinite(windowWidth) ||
      windowWidth <= 0 ||
      originX < windowWidth) {
      return frame;
    }

    const boundFrame: Frame = new Frame(
      originX % windowWidth,
      frame.origin.y,
      frame.size.width,
      frame.size.height,
    );

    return boundFrame;
  };

  const onUIManagerMeasure = (x: number, y: number, w: number, h: number): void => {
    if (!w && !h) {
      measureSelf();
    } else {
      const originY = props.shouldUseTopInsets ? y + StatusBar.currentHeight || 0 : y;
      const frame: Frame = bindToWindow(new Frame(x, originY, w, h), Frame.window());
      props.onMeasure(frame);
    }
  };

  const measureSelf = (): void => {
    const current = nodeRef.current;
    if (current == null) {
      return;
    }
    if (typeof current.measureInWindow === 'function') {
      current.measureInWindow(onUIManagerMeasure);
    } else {
      const node = findNodeHandle(current);
      if (node != null) {
        UIManager.measureInWindow(node, onUIManagerMeasure);
      }
    }
  };

  const callbackRef = React.useCallback((node: MeasurableNode | null) => {
    nodeRef.current = node;
  }, []);

  React.useEffect(() => {
    if (props.force) {
      measureSelf();
    }
  });

  return React.cloneElement(props.children, { ref: callbackRef, onLayout: measureSelf });
};

MeasureElement.defaultProps = {
  shouldUseTopInsets: false,
};

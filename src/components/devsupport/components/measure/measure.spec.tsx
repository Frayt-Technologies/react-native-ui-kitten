import React from 'react';
import {
  Dimensions,
  ScaledSize,
  View,
} from 'react-native';
import {
  render,
  waitForElement,
} from 'react-native-testing-library';
import { MeasureElement } from './measure.component';
import {
  Frame,
  Point,
  Size,
} from './type';

type MeasureInWindowCallback = (x: number, y: number, w: number, h: number) => void;
type TestChildProps = React.ComponentProps<typeof View> & {
  onMeasureInWindow: (callback: MeasureInWindowCallback) => void;
};
type TestChildHandle = {
  measureInWindow: (callback: MeasureInWindowCallback) => void;
};

describe('@measure: frame class instance checks', () => {

  const lhsFrame: Frame = new Frame(2, 2, 2, 2);
  const rhsFrame: Frame = new Frame(4, 4, 2, 2);

  it('left of', () => {
    const { origin: { x, y } } = rhsFrame.leftOf(lhsFrame);

    expect(x).toEqual(0);
    expect(y).toEqual(4);
  });

  it('top of', () => {
    const { origin: { x, y } } = rhsFrame.topOf(lhsFrame);

    expect(x).toEqual(4);
    expect(y).toEqual(0);
  });

  it('right of', () => {
    const { origin: { x, y } } = rhsFrame.rightOf(lhsFrame);

    expect(x).toEqual(4);
    expect(y).toEqual(4);
  });

  it('bottom of', () => {
    const { origin: { x, y } } = rhsFrame.bottomOf(lhsFrame);

    expect(x).toEqual(4);
    expect(y).toEqual(4);
  });

  it('center horizontal of', () => {
    const { origin: { x, y } } = rhsFrame.centerHorizontalOf(lhsFrame);

    expect(x).toEqual(2);
    expect(y).toEqual(4);
  });

  it('center vertical of', () => {
    const { origin: { x, y } } = rhsFrame.centerVerticalOf(lhsFrame);

    expect(x).toEqual(4);
    expect(y).toEqual(2);
  });

  it('center of', () => {
    const { origin: { x, y } } = rhsFrame.centerOf(lhsFrame);

    expect(x).toEqual(2);
    expect(y).toEqual(2);
  });

  it('point equals', () => {
    expect(Point.zero().equals(new Point(0, 0))).toBeTruthy();
    expect(Point.zero().equals(new Point(0, 1))).toBeFalsy();
    expect(Point.zero().equals(null)).toBeFalsy();
  });

  it('size equals', () => {
    expect(Size.zero().equals(new Size(0, 0))).toBeTruthy();
    expect(Size.zero().equals(new Size(0, 1))).toBeFalsy();
    expect(Size.zero().equals(null)).toBeFalsy();
  });

  it('frame equals', () => {
    expect(Frame.zero().equals(new Frame(0, 0, 0, 0))).toBeTruthy();
    expect(Frame.zero().equals(new Frame(0, 0, 0, 1))).toBeFalsy();
    expect(Frame.zero().equals(null)).toBeFalsy();
  });

});

describe('@measure: measure element checks', () => {

  const windowSize: ScaledSize = {
    width: 100,
    height: 200,
    scale: 1,
    fontScale: 1,
  };

  const TestChild = React.forwardRef<TestChildHandle, TestChildProps>(({ onMeasureInWindow, ...props }, ref) => {
    React.useImperativeHandle(ref, () => ({
      measureInWindow: onMeasureInWindow,
    }), [onMeasureInWindow]);

    return <View {...props} />;
  });

  TestChild.displayName = 'TestChild';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('binds large x coordinates to the current window', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue(windowSize);

    const onMeasure = jest.fn();
    const measureInWindow = jest.fn((callback) => callback(305, 10, 20, 30));

    render(
      <MeasureElement
        force={true}
        onMeasure={onMeasure}
      >
        <TestChild onMeasureInWindow={measureInWindow} />
      </MeasureElement>,
    );

    await waitForElement(() => {
      expect(onMeasure).toHaveBeenCalledWith(new Frame(5, 10, 20, 30));
      return null;
    });
  });

  it('guards against invalid coordinates without recurring forever', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue(windowSize);

    const onMeasure = jest.fn();
    const measureInWindow = jest.fn((callback) => callback(Number.POSITIVE_INFINITY, 10, 20, 30));

    render(
      <MeasureElement
        force={true}
        onMeasure={onMeasure}
      >
        <TestChild onMeasureInWindow={measureInWindow} />
      </MeasureElement>,
    );

    await waitForElement(() => {
      expect(onMeasure).toHaveBeenCalledWith(new Frame(Number.POSITIVE_INFINITY, 10, 20, 30));
      return null;
    });
  });
});

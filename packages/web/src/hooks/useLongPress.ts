import { useState } from 'react';

interface UseLongPressOptions {
  pressTime?: number;
  onLongPress?: () => void;
  enable?: boolean;
}

export const useLongPress = ({
  pressTime = 1_000,
  onLongPress,
  enable = true,
}: UseLongPressOptions) => {
  const [baseTime, setBaseTime] = useState(0);

  const handleTouchStart = () => {
    setBaseTime(Date.now());
  };

  const handleTouchEnd = () => {
    try {
      const pressedTime = Date.now() - baseTime;

      if (pressTime < pressedTime) {
        onLongPress?.();
      }
    } finally {
      setBaseTime(0);
    }
  };

  return {
    register: enable
      ? {
          onTouchStart: handleTouchStart,
          onTouchEnd: handleTouchEnd,
          onTouchCancel: handleTouchEnd,
        }
      : {},
    isPressing: !!baseTime,
  };
};

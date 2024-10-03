'use client';

import { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

import { cn } from '@/utils/cn';
import { Box, Text } from '@radix-ui/themes';

interface ValidationMessageProps {
  message?: string;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const [validationMessage, setValidationMessage] = useState(message);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (message) {
      setValidationMessage(message);
    }
  }, [message]);

  return (
    <Transition
      mountOnEnter
      unmountOnExit
      in={!!message}
      nodeRef={nodeRef}
      timeout={300}
      onEntering={() => {
        if (ref.current) {
          setHeight(ref.current.offsetHeight);
        }
      }}
    >
      {(state) => {
        return (
          <Box
            ref={nodeRef}
            className={cn('transition-[height,margin] mt-1 overflow-hidden', {
              'animate-fade-down animate-duration-300 duration-300':
                state === 'entering',
              'duration-300 animate-fade-down animate-reverse animate-duration-300 mt-0':
                state === 'exiting',
              'mt-0': state === 'exited',
            })}
            height={{
              initial: ['entering', 'entered'].includes(state)
                ? `${height}px`
                : '0px',
            }}
          >
            <Text ref={ref} as="p" color="red" size="1">
              {validationMessage}
            </Text>
          </Box>
        );
      }}
    </Transition>
  );
};

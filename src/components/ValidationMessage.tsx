'use client';

import { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

import { cn } from '@/utils/cn';

interface ValidationMessageProps {
  message?: string;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);
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
          <div
            ref={nodeRef}
            className={cn(
              'transition-[height,margin] mt-2 px-2 overflow-hidden',
              {
                'animate-fade-down animate-duration-300 duration-300':
                  state === 'entering',
                'duration-300 animate-fade-down animate-reverse animate-duration-300 m-0':
                  state === 'exiting',
                'mt-0': state === 'exited',
              },
            )}
            style={{
              height: ['entering', 'entered'].includes(state)
                ? `${height}px`
                : '0px',
            }}
          >
            <p ref={ref} className="text-sm text-red-300">
              {validationMessage}
            </p>
          </div>
        );
      }}
    </Transition>
  );
};

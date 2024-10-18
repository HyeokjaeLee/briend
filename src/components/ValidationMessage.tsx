'use client';

interface ValidationMessageProps {
  message?: string;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  return <p>{message}</p>;
};

/**
 * 
 * enum ANIMATION_STATUS {
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting',
  EXITED = 'exited',
}


 * const nodeRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);
  const [validationMessage, setValidationMessage] = useState(message);
  const [height, setHeight] = useState(0);
  const [animationStatus, setAnimationStatus] = useState<ANIMATION_STATUS>(
    ANIMATION_STATUS.EXITED,
  );

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
 */

'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RiCloseLargeLine } from 'react-icons/ri';
import { useSwipeable } from 'react-swipeable';

import { SELECTOR } from '@/constants';
import { MEDIA_QUERY_BREAK_POINT, useGlobalStore } from '@/stores';
import { cn, CustomError, ERROR } from '@/utils';
import { createOnlyClientComponent } from '@/utils/client';

import { CustomIconButton } from '../atoms/CustomIconButton';

interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

const TRANSITION = { type: 'spring', damping: 100, stiffness: 1000 } as const;

export const Drawer = createOnlyClientComponent(
  ({ open, onClose, children, className }: DrawerProps) => {
    const dynamicContainer = document.getElementById(
      SELECTOR.DYNAMIC_CONTAINER,
    );

    if (!dynamicContainer)
      throw new CustomError(ERROR.UNKNOWN_VALUE('dynamicContainer'));

    const y = useMotionValue('100%');

    const backdropFilter = useTransform(
      y,
      (y) => `blur(${2 - parseInt(y) / 50}px)`,
    );

    const opacity = useTransform(y, (y) => `opacity(${1 - parseInt(y) / 100})`);

    const [height, setHeight] = useState(0);

    const lastY = useRef(0);
    const lastYResetTimer = useRef<NodeJS.Timeout | null>(null);

    const isSmallScreen = useGlobalStore(
      (state) => state.mediaQueryBreakPoint < MEDIA_QUERY_BREAK_POINT.sm,
    );

    const swipeHandlers = useSwipeable({
      trackMouse: isSmallScreen,
      onSwiping: (e) => {
        if (lastYResetTimer.current) clearTimeout(lastYResetTimer.current);

        const percentDeltaY = (e.deltaY / height) * 100;
        const percentCurrentY = lastY.current + percentDeltaY;

        if (percentCurrentY <= 0) return;

        y.set(percentCurrentY + '%');
      },
      onSwiped: (e) => {
        lastY.current += (e.deltaY / height) * 100 + 10 * e.velocity ** 2;

        animate(y, lastY.current + '%', TRANSITION);

        const isClose =
          50 < lastY.current ||
          (e.dir === 'Down' && 250 < e.deltaY && 1.5 < e.velocity);

        if (isClose) {
          lastY.current = 0;

          return onClose?.();
        }

        lastYResetTimer.current = setTimeout(() => {
          animate(y, '0%', TRANSITION);
          lastY.current = 0;
          lastYResetTimer.current = null;
        }, 300);
      },
    });

    return createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute z-50 flex size-full items-end bg-zinc-300/10"
            exit={{ opacity: 0 }}
            style={{
              backdropFilter,
            }}
            onClick={(e) => {
              e.preventDefault();
              onClose?.();
            }}
          >
            <motion.div
              ref={(e) => {
                setHeight(e?.offsetHeight ?? 0);
              }}
              animate={{ y: '0%' }}
              className="relative w-full overflow-hidden rounded-t-3xl bg-white shadow-lg-top"
              exit={{ y: '100%' }}
              initial={{ y: '100%' }}
              style={{ y }}
              transition={{
                type: 'spring',
                damping: 100,
                stiffness: 1000,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <header
                {...swipeHandlers}
                className={cn(
                  'flex h-14 w-full items-center bg-white',
                  isSmallScreen
                    ? 'cursor-grab active:cursor-grabbing justify-center'
                    : 'justify-end pr-7',
                )}
              >
                {isSmallScreen ? (
                  <div className="h-1.5 w-17 rounded-md bg-zinc-100" />
                ) : (
                  <CustomIconButton size="3" variant="ghost" onClick={onClose}>
                    <RiCloseLargeLine className="size-5 text-slate-900" />
                  </CustomIconButton>
                )}
              </header>
              <div className="relative max-h-[calc(100dvh-5rem)] overflow-auto">
                <motion.article
                  className={cn(
                    'relative mx-auto max-w-screen-sm px-4',
                    className,
                  )}
                  style={{ opacity }}
                >
                  {children}
                </motion.article>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      dynamicContainer,
    );
  },
);

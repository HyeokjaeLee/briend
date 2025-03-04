'use client';

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { RiCloseLargeLine } from 'react-icons/ri';
import { useSwipeable } from 'react-swipeable';

import { IS_TOUCH_DEVICE } from '@/constants';
import { cn } from '@/utils';
import { createOnlyClientComponent } from '@/utils/client';

import { Button } from '../atoms/Button';
import { DotLottie } from '../atoms/DotLottie';

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  footer?: React.ReactNode;
}

const TRANSITION = { type: 'spring', damping: 100, stiffness: 1000 } as const;

export const Drawer = createOnlyClientComponent(
  ({ open, onClose, children, className, loading, footer }: DrawerProps) => {
    const y = useMotionValue('100%');

    const overlayColor = useTransform(
      y,
      (y) => `rgba(0, 0, 0, ${(1 - parseInt(y) / 100) * 0.8})`,
    );

    const opacity = useTransform(y, (y) => `opacity(${1 - parseInt(y) / 100})`);

    const ref = useRef<HTMLDivElement>(null);

    const height = ref.current?.offsetHeight ?? 0;

    const lastY = useRef(0);
    const lastYResetTimer = useRef<NodeJS.Timeout | null>(null);

    const swipeHandlers = useSwipeable({
      onSwiping: (e) => {
        if (lastYResetTimer.current) clearTimeout(lastYResetTimer.current);

        const percentDeltaY = (e.deltaY / height) * 100;
        const percentCurrentY = lastY.current + percentDeltaY;

        if (percentCurrentY < 0) return;

        y.set(percentCurrentY + '%');
      },
      onSwiped: (e) => {
        const percentDeltaY =
          lastY.current + (e.deltaY / height) * 100 + 10 * e.velocity ** 2;

        if (percentDeltaY < 0) return;

        lastY.current = percentDeltaY;

        animate(y, percentDeltaY + '%', TRANSITION);

        const isClose =
          50 < percentDeltaY ||
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
            data-slot="drawer-overlay"
            className={cn(
              'z-25 fixed inset-0',
              'bg-black/80',
              'flex size-full items-end bg-zinc-300/10',
              {
                'pointer-events-none': loading,
              },
            )}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: overlayColor,
            }}
            onClick={(e) => {
              e.preventDefault();
              onClose?.();
            }}
          >
            <motion.div
              ref={ref}
              animate={{ y: '0%' }}
              className="shadow-lg-top relative w-full overflow-hidden rounded-t-xl bg-white"
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
              {loading ? (
                <div className="flex-center animate-fade absolute z-10 size-full cursor-wait rounded-xl bg-white">
                  <DotLottie
                    src="/assets/lottie/common-skeleton.lottie"
                    className="animate-fade size-full"
                  />
                </div>
              ) : null}
              <div
                {...swipeHandlers}
                data-slot="drawer-handle"
                className={cn(
                  'flex h-16 w-full items-center bg-white',
                  IS_TOUCH_DEVICE
                    ? 'cursor-grab justify-center active:cursor-grabbing'
                    : 'justify-end',
                  {
                    'pointer-events-none invisible': loading,
                  },
                )}
              >
                {IS_TOUCH_DEVICE ? (
                  <div className="w-25 bg-muted h-2 rounded-md" />
                ) : (
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    onlyIcon
                    className="mr-2 mt-2"
                    aria-label="close"
                  >
                    <RiCloseLargeLine className="size-7" />
                  </Button>
                )}
              </div>
              <div className="relative max-h-[calc(100dvh-5rem)] overflow-auto">
                <motion.article
                  data-slot="drawer-content"
                  className={cn(
                    'relative mx-auto max-w-screen-sm px-4 pb-4',
                    className,
                  )}
                  style={{ opacity }}
                >
                  {children}

                  {footer ? <footer className="my-4">{footer}</footer> : null}
                </motion.article>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );
  },
);

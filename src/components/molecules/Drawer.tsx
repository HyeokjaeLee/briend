'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { SELECTOR } from '@/constants';
import { CustomError, ERROR } from '@/utils';
import { createOnlyClientComponent } from '@/utils/client';

interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Drawer = createOnlyClientComponent(
  ({ open, onClose, children }: DrawerProps) => {
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

    const [height, setHeight] = useState(0);

    return createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute z-50 flex size-full items-end"
            style={{
              backdropFilter,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
          >
            <motion.div
              ref={(e) => {
                setHeight(e?.offsetHeight ?? 0);
              }}
              animate={{ y: '0%' }}
              className="relative max-h-[calc(100dvh-5rem)] w-full overflow-auto rounded-t-3xl bg-white shadow-lg-top"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 1 }}
              exit={{ y: '100%' }}
              initial={{ y: '100%' }}
              style={{ y }}
              transition={{ type: 'spring', damping: 100, stiffness: 1000 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onDragEnd={(
                _,
                { velocity: { y: velocityY }, offset: { y: offsetY } },
              ) => {
                const shouldClose =
                  (500 < velocityY && 200 < offsetY) || height / 2 < offsetY;

                if (shouldClose) {
                  onClose?.();
                }
              }}
            >
              <article>
                <div
                  className="sticky top-3 mx-auto my-3 h-1.5 w-12 cursor-grab rounded-full bg-gray-300 active:cursor-grabbing"
                  onPointerDown={(e) => e.preventDefault()}
                />
                {children}

                <div className="h-[9999px]">
                  ssasfasfasfasfasfafasfasfasfasfasfasfasfasfasfasfasfasfasfas.lfaslfjkaslkfjlasjfl;asjklfasjlkfasjklfjaslkfjaslfkasjlfkasjflkasjflksajflkasjflkasjflkasjflkasfjaslkfjaslkfjalsks
                </div>
              </article>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      dynamicContainer,
    );
  },
);

/**
 *
 */

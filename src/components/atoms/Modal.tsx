import { AnimatePresence, motion } from 'framer-motion';

import { RiCloseLine } from 'react-icons/ri';

import { cn } from '@/utils/cn';
import { Portal } from '@radix-ui/themes';

import { CustomIconButton } from './CustomIconButton';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
}

const MODAL_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const Modal = ({ children, className, open, onClose }: ModalProps) => (
  <AnimatePresence>
    {open ? (
      <Portal className="fixed inset-0 z-20 bg-zinc-900/50 backdrop-blur-sm">
        <motion.article
          {...MODAL_ANIMATION}
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'rounded-lg bg-white',
          )}
        >
          <header className="m-3 flex justify-end">
            <CustomIconButton
              color="gray"
              radius="large"
              size="3"
              variant="ghost"
              onClick={onClose}
            >
              <RiCloseLine className="size-8" />
            </CustomIconButton>
          </header>
          <section
            className={cn(
              'relative mx-5 mb-5 flex flex-col items-center h-full',
              'min-w-80 min-h-96 max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]',
              className,
            )}
          >
            {children}
          </section>
        </motion.article>
      </Portal>
    ) : null}
  </AnimatePresence>
);

import { RiCloseLine } from 'react-icons/ri';

import { cn } from '@/utils';
import { Kbd, Portal } from '@radix-ui/themes';

import { CustomIconButton } from '../atoms/CustomIconButton';

export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
  hasCloseButton?: boolean;
  title?: React.ReactNode;
}

export const Modal = ({
  children,
  className,
  open,
  onClose,
  hasCloseButton = false,
  title,
}: ModalProps) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <Portal asChild>
      <dialog
        className={cn(
          'fixed z-20 size-full bg-zinc-900/50 backdrop-blur-sm',
          'animate-duration-150 animate-fade',
        )}
        open={open}
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose?.();
        }}
        onMouseEnter={({ target }) => {
          if ('focus' in target) {
            (target as HTMLElement).focus();
          }
        }}
      >
        <Kbd className="absolute right-2 top-2">ESC</Kbd>
        <article
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg',
            'rounded-lg bg-white',
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {hasCloseButton || title ? (
            <header className="mx-5 mt-5 flex items-center justify-end">
              {title ? (
                <h3 className="w-full text-start text-xl font-semibold">
                  {title}
                </h3>
              ) : null}
              {hasCloseButton ? (
                <CustomIconButton
                  color="gray"
                  radius="large"
                  size="3"
                  variant="ghost"
                  onClick={handleClose}
                >
                  <RiCloseLine className="size-8" />
                </CustomIconButton>
              ) : null}
            </header>
          ) : null}
          <section
            className={cn(
              'relative m-5 flex flex-col items-center h-full',
              'min-w-52 min-h-24 max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]',
              className,
            )}
          >
            {children}
          </section>
        </article>
      </dialog>
    </Portal>
  );
};

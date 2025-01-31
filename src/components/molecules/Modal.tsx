import { RiCloseLine } from 'react-icons/ri';

import { cn } from '@/utils';
import { Kbd, Portal, Spinner } from '@radix-ui/themes';

import { CustomIconButton } from '../atoms/CustomIconButton';

export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
  hasCloseButton?: boolean;
  title?: React.ReactNode;
  loading?: boolean;
  rootClassName?: string;
}

export const Modal = ({
  children,
  className,
  open,
  onClose,
  hasCloseButton = false,
  title,
  loading,
  rootClassName,
}: ModalProps) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <Portal asChild>
      <dialog
        className={cn(
          'fixed z-30 size-full bg-zinc-900/10 backdrop-blur-sm',
          'animate-duration-150 animate-fade',
          rootClassName,
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
        <div className="size-full flex-center">
          <article
            className={cn(
              'shadow-lg rounded-lg bg-white relative',
              'max-w-[calc(100%-1rem)] max-h-[calc(100%-1rem)]',
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <dialog
              className="z-10 size-full rounded-lg bg-white/90"
              open={loading}
            >
              <div className="h-full flex-center">
                <Spinner className="my-auto" size="3" />
              </div>
            </dialog>
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
                'relative m-5 flex flex-col items-center h-full min-h-28 min-w-0 xs:min-w-96',
                className,
              )}
            >
              {children}
            </section>
          </article>
        </div>
      </dialog>
    </Portal>
  );
};

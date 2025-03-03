'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { cn } from '@/utils';

import { Button } from '../atoms/Button';
import { DotLottie } from '../atoms/DotLottie';

export interface ModalProps
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
    React.ComponentProps<typeof DialogPrimitive.Root> {
  header?: React.ReactNode;
  description?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  closeButton?: boolean;
  loading?: boolean;
  rootClassName?: string;
}

export const Modal = ({
  modal,
  onOpenChange,
  defaultOpen,
  open,
  description,
  trigger,
  className,
  children,
  header,
  footer,
  closeButton = true,
  loading,
  rootClassName,
  ...restProps
}: ModalProps) => {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      modal={modal}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      open={loading || open}
    >
      {trigger ? (
        <DialogPrimitive.Trigger data-slot="dialog-trigger" asChild>
          {trigger}
        </DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal data-slot="dialog-portal">
        <DialogPrimitive.Overlay
          data-slot="dialog-overlay"
          className={cn(
            'animate-fade animate-duration-150 fixed inset-0 z-30 bg-black/80',
            rootClassName,
          )}
        />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          asChild
          className={cn(
            'bg-background text-primary fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border shadow-lg duration-200 sm:max-w-lg',
            'p-6',
            'data-[state=open]:animate-fade-down data-[state=open]:animate-duration-300',
            className,
          )}
          {...restProps}
        >
          <article>
            {loading ? (
              <div className="flex-center animate-fade absolute z-10 size-full cursor-wait rounded-xl bg-white">
                <DotLottie
                  className={cn('animate-fade z-10 h-40')}
                  src="/assets/lottie/spinner.lottie"
                />
              </div>
            ) : null}
            <header
              data-slot="dialog-header"
              className="relative flex flex-col gap-2 text-left"
            >
              {typeof header === 'string' ? (
                <DialogPrimitive.Title
                  data-slot="dialog-title"
                  className="text-xl font-semibold leading-none"
                >
                  {header}
                </DialogPrimitive.Title>
              ) : (
                header
              )}
              {closeButton ? (
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    onlyIcon
                    aria-label="close"
                    className="absolute -right-5 -top-5"
                  >
                    <RiCloseLine className="size-7" />
                  </Button>
                </DialogPrimitive.Close>
              ) : null}
              {typeof description === 'string' ? (
                <DialogPrimitive.Description
                  data-slot="dialog-description"
                  className="text-primary/50 text-sm"
                >
                  {description}
                </DialogPrimitive.Description>
              ) : (
                description
              )}
            </header>
            {children}
            <footer
              data-slot="dialog-footer"
              className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
            >
              {footer}
            </footer>
          </article>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

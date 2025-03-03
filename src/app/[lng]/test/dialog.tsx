'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { Button } from '@/components';
import { cn } from '@/utils';

interface DialogProps
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
    React.ComponentProps<typeof DialogPrimitive.Root> {
  header?: React.ReactNode;
  description?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Dialog = ({
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
  ...restProps
}: DialogProps) => {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      modal={modal}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      open={open}
    >
      <DialogPrimitive.Trigger data-slot="dialog-trigger" asChild>
        {trigger}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal data-slot="dialog-portal">
        <DialogPrimitive.Overlay
          data-slot="dialog-overlay"
          className={cn(
            'animate-fade animate-duration-150 fixed inset-0 z-30 bg-black/80',
            className,
          )}
        />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          asChild
          className={cn(
            'bg-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 text-primary fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 sm:max-w-lg',
            'p-6',
            'data-[state=open]:animate-fade-down data-[state=open]:animate-duration-300',
            className,
          )}
          {...restProps}
        >
          <article>
            <header
              data-slot="dialog-header"
              className={cn(
                'relative flex flex-col gap-2 text-left',
                className,
              )}
            >
              {typeof header === 'string' ? (
                <DialogPrimitive.Title
                  data-slot="dialog-title"
                  className={cn(
                    'text-xl font-semibold leading-none',
                    className,
                  )}
                >
                  {header}
                </DialogPrimitive.Title>
              ) : (
                header
              )}
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
              {typeof description === 'string' ? (
                <DialogPrimitive.Description
                  data-slot="dialog-description"
                  className={cn('text-primary/50 text-sm', className)}
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
              className={cn(
                'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
              )}
            >
              {footer}
            </footer>
          </article>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

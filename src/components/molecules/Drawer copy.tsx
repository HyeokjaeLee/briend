'use client';

import * as React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Drawer as DrawerPrimitive } from 'vaul';

import { Button, DotLottie } from '@/components';
import { IS_TOUCH_DEVICE } from '@/constants';
import { cn } from '@/utils';

export interface DrawerProps
  extends React.ComponentProps<typeof DrawerPrimitive.Content>,
    Pick<
      React.ComponentProps<typeof DrawerPrimitive.Root>,
      | 'handleOnly'
      | 'open'
      | 'onOpenChange'
      | 'direction'
      | 'activeSnapPoint'
      | 'setActiveSnapPoint'
      | 'snapPoints'
    > {
  trigger?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  loading?: boolean;
}

export const Drawer = ({
  children,
  className,
  open,
  onOpenChange,
  header,
  footer,
  description,
  trigger,
  direction = 'bottom',
  loading,
  activeSnapPoint,
  snapPoints,
  setActiveSnapPoint,
  ...restProps
}: DrawerProps) => (
  <DrawerPrimitive.Root
    data-slot="drawer"
    direction={direction}
    open={open}
    onOpenChange={onOpenChange}
    snapPoints={snapPoints}
    setActiveSnapPoint={setActiveSnapPoint}
    activeSnapPoint={activeSnapPoint}
    closeThreshold={0.8}
  >
    {trigger ? (
      <DrawerPrimitive.Trigger data-slot="drawer-trigger" asChild>
        {trigger}
      </DrawerPrimitive.Trigger>
    ) : null}
    <DrawerPrimitive.Portal data-slot="drawer-portal">
      <DrawerPrimitive.Overlay
        data-slot="drawer-overlay"
        className={cn(
          'z-25 fixed inset-0',
          'bg-black/80',
          'transition-opacity duration-300 ease-in-out',
          'data-[state=open]:animate-fade data-[state=open]:animate-duration-150',
          'data-[state=closed]:animate-fade-out data-[state=closed]:animate-duration-200',
        )}
      />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'group/drawer-content bg-background fixed z-30 h-auto',
          'transition-transform duration-1000 ease-in-out',

          'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80dvh] data-[vaul-drawer-direction=top]:rounded-b-xl',

          'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80dvh] data-[vaul-drawer-direction=bottom]:rounded-t-xl',

          'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm',

          'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm',
          className,
        )}
        {...restProps}
      >
        {loading ? (
          <div className="flex-center animate-fade absolute z-10 size-full cursor-wait rounded-xl bg-white">
            <DotLottie
              className={cn('animate-fade z-10 h-40')}
              src="/assets/lottie/spinner.lottie"
            />
          </div>
        ) : null}
        {IS_TOUCH_DEVICE ? (
          <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-md group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        ) : (
          <DrawerPrimitive.Close data-slot="drawer-close" asChild>
            <Button
              variant="ghost"
              onlyIcon
              aria-label="close"
              className="absolute right-1 top-1"
            >
              <RiCloseLine className="size-7" />
            </Button>
          </DrawerPrimitive.Close>
        )}
        <article
          className={cn('mx-auto h-auto max-w-screen-lg overflow-auto', {
            'mt-6': !IS_TOUCH_DEVICE,
            'mb-4': !footer,
          })}
        >
          <header
            data-slot="drawer-header"
            className="flex flex-col gap-1.5 p-4"
          >
            <DrawerPrimitive.Title
              data-slot="drawer-title"
              className="text-xl font-semibold leading-none"
              asChild={typeof header !== 'string' && !!header}
            >
              {header}
            </DrawerPrimitive.Title>
            {typeof description === 'string' ? (
              <DrawerPrimitive.Description
                data-slot="drawer-description"
                className="text-primary/50 text-sm"
              >
                {description}
              </DrawerPrimitive.Description>
            ) : (
              description
            )}
          </header>
          {children}
          {footer ? (
            <footer
              data-slot="drawer-footer"
              className={cn('mt-auto flex flex-col gap-2 p-4')}
            >
              {footer}
            </footer>
          ) : null}
        </article>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  </DrawerPrimitive.Root>
);

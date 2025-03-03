'use client';

import { Avatar } from '@radix-ui/themes';

import { Modal } from '@/components';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

export default function TestPage() {
  return (
    <article className="p-4">
      <Modal>modal</Modal>
      <Dialog modal>
        <DialogTrigger>test</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          ss
        </DialogContent>
      </Dialog>
    </article>
  );
}

export const dynamic = 'force-static';

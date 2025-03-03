'use client';

import { Button, Modal } from '@/components';

export default function TestPage() {
  return (
    <article className="p-4">
      <Modal
        header="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        trigger={<Button>Test</Button>}
        footer={<Button>Test</Button>}
      >
        테스트
      </Modal>
    </article>
  );
}

export const dynamic = 'force-static';

/**
 </Dialog>
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
      </Dialog> */

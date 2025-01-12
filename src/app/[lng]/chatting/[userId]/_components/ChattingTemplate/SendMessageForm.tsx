'use client';

import type { useMessageForm } from './_hooks/useMessageForm';

import { nanoid } from 'nanoid';

import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { useTranslation } from '@/app/i18n/client';
import { CustomIconButton } from '@/components';
import { COOKIES } from '@/constants';
import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { useCookies, useUserId } from '@/hooks';
import type { FriendPeer } from '@/stores/peer';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { assert, cn } from '@/utils';

interface SendMessageFormProps {
  form: ReturnType<typeof useMessageForm>['form'];
  friendUserId: string;
  friendPeer: FriendPeer;
}

interface SendMessageFormValues {
  message: string;
}

export const SendMessageForm = ({
  friendPeer,
  friendUserId,
}: SendMessageFormProps) => {
  const { t } = useTranslation('chatting');

  const form = useForm<SendMessageFormValues>();

  const myUserId = useUserId();

  return (
    <form
      onSubmit={form.handleSubmit(async ({ message }) => {
        assert(myUserId);

        const id = nanoid();

        const data = {
          fromUserId: myUserId,
          message,
          state: MESSAGE_STATE.SENT,
          timestamp: Date.now(),
          translatedMessage: '',
        };

        await messageTable?.add({
          id,
          toUserId: friendUserId,
          ...data,
        });

        await friendPeer.connection?.send({
          id,
          type: MESSAGE_TYPE.MESSAGE,
          data,
        } satisfies PeerData);
      })}
    >
      <section className="flex items-end gap-2">
        <div
          className={cn(
            'rounded-md border bg-gray-50 px-3.5 py-[12.5px] flex-center flex-1',
            'transition-colors duration-75 border-zinc-50 focus-within:border-zinc-200',
          )}
        >
          <TextareaAutosize
            {...form.register('message')}
            cacheMeasurements
            className="w-full resize-none bg-transparent outline-none hide-scrollbar"
            maxRows={4}
            placeholder={t('send-form-placeholder')}
            title="message-input"
          />
        </div>
        <CustomIconButton
          className="mb-[6.5px] rounded-full"
          disabled={!friendPeer.isConnected}
          size="3"
          title="send-message"
          type="submit"
        >
          <RiSendPlane2Line className="ml-1 size-6 animate-jump-in animate-duration-300" />
        </CustomIconButton>
      </section>
    </form>
  );
};

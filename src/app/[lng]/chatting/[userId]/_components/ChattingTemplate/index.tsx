'use client';

import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { CustomBottomNav, LoadingTemplate } from '@/components';
import { useCheckIndividualPeer } from '@/hooks';
import { usePeerStore } from '@/stores';
import { CustomError, ERROR } from '@/utils';

import { SendMessageForm } from './SendMessageForm';

interface ChattingTemplateProps {
  userId: string;
}

interface SendMessageFormValues {
  message: string;
  peerId: string;
}

export const ChattingTemplate = ({ userId }: ChattingTemplateProps) => {
  const [isMounted, friendPeer] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.friendConnections.data.get(userId),
    ]),
  );

  const { isLoading } = useCheckIndividualPeer(userId);

  const form = useForm<SendMessageFormValues>();

  if (!isMounted || isLoading) return <LoadingTemplate />;

  if (!friendPeer) throw new CustomError(ERROR.UNAUTHORIZED());

  const onSubmit = (values: SendMessageFormValues) => {
    form.reset();
  };

  return (
    <article>
      <SendMessageForm form={form} />
    </article>
  );
};

import { useForm } from 'react-hook-form';

export interface SendMessageFormValues {
  message: string;
  peerId: string;
}

export const useMessageForm = () => {
  const form = useForm<SendMessageFormValues>();

  return { form };
};

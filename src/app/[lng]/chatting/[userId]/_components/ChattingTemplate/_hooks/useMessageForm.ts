import { useForm } from 'react-hook-form';

interface SendMessageFormValues {
  message: string;
  peerId: string;
}

export const useMessageForm = () => {
  const form = useForm<SendMessageFormValues>();

  return { form };
};

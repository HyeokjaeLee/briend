import { useForm } from 'react-hook-form';

export interface SendMessageFormValues {
  message: string;
  //TODO: 안쓸것 같음
  peerId: string;
}

export const useMessageForm = () => {
  const form = useForm<SendMessageFormValues>();

  return { form };
};

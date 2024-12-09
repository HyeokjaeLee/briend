'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { CustomBottomNav } from '@/components/atoms/CustomBottomNav';
import { LANGUAGE } from '@/constants/language';

import { SendMessageForm } from './SendMessageForm';
import { TranslatedMessage } from './TranslatedMessage';
import { useOnDeviceAiTranslate } from './_hooks/useOnDeviceAiTranslate';

interface SendMessageFormValues {
  message: string;
  translatedMessage: string;
}

export type Form = UseFormReturn<SendMessageFormValues, any, undefined>;

export const UserActionSection = () => {
  const form = useForm<SendMessageFormValues>();

  const { isLoading, translate } = useOnDeviceAiTranslate({
    onTranslate: (text) => {
      console.info(text);

      form.setValue('translatedMessage', text);
    },
  });

  console.info(isLoading);

  return (
    <CustomBottomNav className="border-t-0 bg-slate-100 p-5">
      <TranslatedMessage form={form} />
      <SendMessageForm
        form={form}
        onChange={(value) =>
          translate?.(value, {
            sourceLang: LANGUAGE.KOREAN,
            targetLang: LANGUAGE.ENGLISH,
          })
        }
      />
    </CustomBottomNav>
  );
};

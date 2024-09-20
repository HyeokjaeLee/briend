import { useTranslation } from '@/app/i18n/client';
import { LANGUAGE } from '@/constants/language';
import { isEnumValue } from '@/utils';
import { Select, TextField } from '@radix-ui/themes';

interface CreateQRSectionProps {
  nicknamePlaceholder: string;
  nickname: string;
  onChangeNickname: (nickname: string) => void;
  language: LANGUAGE;
  onChangeLanguage: (language: LANGUAGE) => void;
}

export const CreateQRSection = ({
  nicknamePlaceholder,
  nickname,
  onChangeNickname,
  language,
  onChangeLanguage,
}: CreateQRSectionProps) => {
  const { t } = useTranslation('invite-chat');

  return (
    <section className="flex flex-1 flex-col gap-5 p-5 text-slate-900">
      <h2 className="text-2xl font-bold">👋 {t('invite-title')}</h2>
      <div className="mx-auto flex w-full max-w-96 flex-1 flex-col items-center justify-center gap-5 p-4">
        <div className="flex w-full flex-col gap-2">
          <label className="font-medium">🌍 {t('friend-language')}</label>
          <Select.Root
            size="3"
            value={language}
            onValueChange={(language) => {
              if (!isEnumValue(LANGUAGE, language))
                throw new Error('Language is not found');

              onChangeLanguage(language);
            }}
          >
            <Select.Trigger className="w-full" variant="soft" />
            <Select.Content>
              {Object.values(LANGUAGE).map((language) => {
                return (
                  <Select.Item key={language} value={language}>
                    {t(language)}
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>
        </div>
        <label className="flex w-full flex-col gap-2 font-medium">
          🏷️ {t('friend-nickname')}
          <TextField.Root
            className="w-full"
            placeholder={nicknamePlaceholder}
            size="3"
            value={nickname}
            variant="soft"
            onChange={(e) => onChangeNickname(e.target.value)}
          />
        </label>
        <p className="mt-10 break-keep text-center text-xl">
          {t('friend-setting-message')}
        </p>
      </div>
    </section>
  );
};

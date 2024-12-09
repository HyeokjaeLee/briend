import type { Form } from '.';

interface TranslatedMessageProps {
  form: Form;
}

export const TranslatedMessage = ({
  form: { watch },
}: TranslatedMessageProps) => {
  const translatedMessage = watch('translatedMessage');

  return <div>{translatedMessage}</div>;
};

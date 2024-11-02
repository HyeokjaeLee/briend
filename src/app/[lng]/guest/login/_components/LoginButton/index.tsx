import { signIn } from '@/auth';
import { cn } from '@/utils/cn';

import {
  LoginButtonContents,
  type LoginButtonContentsProps,
} from './LoginButtonContents';

export const LoginButton = async (props: LoginButtonContentsProps) => {
  return (
    <form
      action={async () => {
        'use server';

        await signIn(props.provider);
      }}
      className={cn('h-14', {
        'w-full': props.fullSize,
      })}
    >
      <LoginButtonContents {...props} />
    </form>
  );
};

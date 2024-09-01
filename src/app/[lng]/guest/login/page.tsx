import { signIn } from '@/auth';

const LoginPage = () => {
  return (
    <article>
      <h1>LOGIN</h1>
      <form
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <button>Signin with Google</button>
      </form>
    </article>
  );
};

export default LoginPage;

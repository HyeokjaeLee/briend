import Logo from '@/assets/logo.svg';

export default function Home() {
  return (
    <div className="flex">
      <div
        className="size-32 bg-zinc-50"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '12px',
          backgroundClip: '#fafafa',
        }}
      >
        <Logo className="h-7 text-gray-600" />
      </div>
    </div>
  );
}
import dynamic from 'next/dynamic';

const SignIn = dynamic(() => import('@/components/SignIn'), { ssr: false });

export default function SignInPage() {
  return <SignIn />;
}
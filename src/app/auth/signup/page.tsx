import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import('@/components/SignUp'), { ssr: false });

export default function SignUpPage() {
  return <SignUp />;
}
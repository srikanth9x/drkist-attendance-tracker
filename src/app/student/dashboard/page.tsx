import dynamic from 'next/dynamic';

const StudentDash = dynamic(() => import('@/components/StudentDash'), { ssr: false });

export default function StudentDashPage() {
  return <StudentDash />;
}
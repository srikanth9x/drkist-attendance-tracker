import dynamic from 'next/dynamic';

const FacultyAdvDash = dynamic(() => import('@/components/FacultyAdvDash'), { ssr: false });

export default function FacultyAdvDashPage() {
  return <FacultyAdvDash />;
}
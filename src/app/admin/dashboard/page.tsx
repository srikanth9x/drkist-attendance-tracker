import dynamic from 'next/dynamic';

const AdminDash = dynamic(() => import('@/components/AdminDash'), { ssr: false });

export default function AdminDashboardPage() {
  return <AdminDash />;
}
'use client';
import { withAuth } from '@/components/withAuth';
import { ProcDetails } from '@/pages/features/procs/ProcDetails';

function DetailsPage({ params }: { params: { proc_id: string } }) {
  return <ProcDetails proc_id={params.proc_id} />;
}

export default withAuth(DetailsPage, {
  requireAdmin: false,
  redirectTo: '/login',
});

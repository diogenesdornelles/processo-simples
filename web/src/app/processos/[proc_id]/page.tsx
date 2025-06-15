'use client';
import { use } from 'react';
import { withAuth } from '@/components/withAuth';
import { ProcDetails } from '@/pages/features/procs/ProcDetails';

function DetailsPage({ params }: { params: Promise<{ proc_id: string }> }) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  return <ProcDetails proc_id={resolvedParams.proc_id} />;
}

export default withAuth(DetailsPage, {
  requireAdmin: false,
  redirectTo: '/login',
});

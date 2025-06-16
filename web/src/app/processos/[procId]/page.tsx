'use client';
import { use } from 'react';
import { withAuth } from '@/components/withAuth';
import { ProcDetails } from '@/pages/features/procs/ProcDetails';

function DetailsPage({ params }: { params: Promise<{ procId: string }> }) {
  const resolvedParams = use(params);

  return <ProcDetails procId={resolvedParams.procId} />;
}

export default withAuth(DetailsPage, {
  requireAdmin: false,
  redirectTo: '/login',
});

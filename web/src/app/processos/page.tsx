'use client';
import { withAuth } from '@/components/withAuth';
import Procs from '@/pages/Procs';

function ProcessosPage() {
  return <Procs />;
}

export default withAuth(ProcessosPage, {
  requireAdmin: false,
  redirectTo: '/login',
});

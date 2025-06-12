'use client';
import { withAuth } from '@/components/withAuth';
import Processos from '@/pages/Processos';

function ProcessosPage() {
  return <Processos />;
}

export default withAuth(ProcessosPage, {
  requireAdmin: false,
  redirectTo: '/login',
});

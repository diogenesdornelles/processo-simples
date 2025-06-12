'use client';

import { withAuth } from '@/components/withAuth';
import Perfis from '@/pages/Perfis';

function PerfisPage() {
  return <Perfis />;
}

export default withAuth(PerfisPage, {
  requireAdmin: false,
  redirectTo: '/login',
});

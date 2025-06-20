'use client';

import { withAuth } from '@/components/withAuth';
import Home from '@/pages/Home';

function RedirectPage() {
  return <Home />;
}

export default withAuth(RedirectPage, {
  requireAdmin: false,
  redirectTo: '/home',
});

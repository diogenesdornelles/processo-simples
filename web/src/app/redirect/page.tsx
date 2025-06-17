'use client';

import { withAuth } from '@/components/withAuth';
import Home from '@/pages/Home';

function HomePage() {
  return <Home />;
}

export default withAuth(HomePage, {
  requireAdmin: false,
  redirectTo: '/login',
});

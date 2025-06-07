import { withAuth } from '@/components/withAuth';

function HomePage() {
  return <>Home</>;
}

export default withAuth(HomePage, {
  requireAdmin: false,
  redirectTo: '/login',
});

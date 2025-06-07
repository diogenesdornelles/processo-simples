import { withAuth } from "@/components/withAuth";

function RegistroPage() {
  return (
    <>Processos</>
  );
}

export default withAuth(RegistroPage, { 
  requireAdmin: true,
  redirectTo: '/unauthorized' 
});
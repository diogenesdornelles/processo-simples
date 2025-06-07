import { withAuth } from "@/components/withAuth";

function ProcessosPage() {
  return (
    <>Processos</>
  );
}

export default withAuth(ProcessosPage, { 
  requireAdmin: false,
  redirectTo: '/login' 
});
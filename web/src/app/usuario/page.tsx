import { withAuth } from "@/components/withAuth";

function UsuarioPage() {
  return (
    <>Processos</>
  );
}

export default withAuth(UsuarioPage, { 
  requireAdmin: false,
  redirectTo: '/login' 
});
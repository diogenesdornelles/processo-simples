// pages/unauthorized.tsx
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Acesso Negado</h2>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <a 
          href="/home" 
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
}
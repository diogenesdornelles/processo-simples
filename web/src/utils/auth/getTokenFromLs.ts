export const getTokenFromLs = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const parsedSession = JSON.parse(token);
    return parsedSession?.token || null;
  } catch (error) {
    console.error('Erro ao parsear a sessão do localStorage:', error);
    return null;
  }
};
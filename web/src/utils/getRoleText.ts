export const getRoleText = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'Administrador';
    case 'Comum':
      return 'Usuário';
    default:
      return role;
  }
};

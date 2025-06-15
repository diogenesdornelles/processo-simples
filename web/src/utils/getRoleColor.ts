export const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'secondary.error.bg';
    case 'User':
      return 'secondary.info.bg';
    default:
      return 'secondary.gray.bg';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'secondary.info.bg';
    case 'Em Andamento':
      return 'secondary.warning.bg';
    case 'Pendente':
      return 'secondary.attention.bg';
    case 'Concluído':
      return 'secondary.success.bg';
    case 'Cancelado':
      return 'secondary.error.bg';
    default:
      return 'secondary.gray.bg';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'secondary.error.bg';
    case 'Média':
      return 'secondary.attention.bg';
    case 'Baixa':
      return 'secondary.info.bg';
    default:
      return 'secondary.gray.bg';
  }
};

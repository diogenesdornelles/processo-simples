export const saveTokenOnLs = (token: string) => {
  localStorage.setItem('token', JSON.stringify({ token }));
};
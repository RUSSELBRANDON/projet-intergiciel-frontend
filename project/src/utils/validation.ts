export const isValidEmail = (email: string): boolean => {
  // Basic email regex, you can use a more comprehensive one if needed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une minuscule.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre.' };
  }
  // You can add more checks, e.g., for special characters
  // if (!/[!@#$%^&*]/.test(password)) {
  //   return { valid: false, message: 'Le mot de passe doit contenir au moins un caractère spécial.' };
  // }
  return { valid: true };
};

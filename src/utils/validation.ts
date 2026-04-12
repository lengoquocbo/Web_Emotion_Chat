export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // >= 8 ký tự + có chữ cái
  return /^(?=.*[A-Za-z]).{8,}$/.test(password);
};
// kiểm tra confirm password có khớp với password không
export const isMatchPassword = (pass: string, confirm: string) => {
  return pass === confirm;
};
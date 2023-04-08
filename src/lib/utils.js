export const isAndroid = (navigator) => {
  return /Android/i.test(navigator.userAgent) ? "127.0.0.1" : "localhost";
};
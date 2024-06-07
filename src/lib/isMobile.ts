export const isMobile = () => {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod|Android.*Mobile/.test(ua);
};

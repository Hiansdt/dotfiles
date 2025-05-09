export function debounce(fn: any, delay: number = 500) {
  let timeout: any = 0;
  return function (...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function withTimeout<T>(
  fn: () => Promise<T>,
  key: string,
  timeoutLength: number = 5000,
) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Request timed out. Key: ${key}`));
    }, timeoutLength);

    try {
      const result = (await fn()) as T;
      resolve(result);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

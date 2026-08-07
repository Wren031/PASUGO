export const mockDelay = (ms = 350): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

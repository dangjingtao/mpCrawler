/**
 * @description debounce
 * @param {Function} fn
 * @param {number} delay
 * @param {boolean} immediate
 * @returns {Function}
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
): T & { cancel(): void } {
  let timerId: ReturnType<typeof setTimeout> | null = null; // 存储定时器

  // 定义一个cancel办法,用于勾销防抖
  const cancel = (): void => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    const context = this;
    if (timerId) {
      cancel();
    }
    if (immediate) {
      // 如果 immediate 为 true 并且没有正在期待执行的定时器，立刻执行指标函数
      if (!timerId) {
        fn.apply(context, args);
      }
      // 设置定时器，在延迟时间后将 timeoutId 设为 null
      timerId = setTimeout(() => {
        timerId = null;
      }, delay);
    } else {
      // 设置定时器，在延迟时间后执行指标函数
      timerId = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  };

  // 将 cancel 办法附加到 debounced 函数上
  (debounced as any).cancel = cancel;
  return debounced as T & { cancel(): void };
}

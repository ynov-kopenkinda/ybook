import { useEffect } from "react";

export function useInterval<T extends Function>(fn: T, ms: number) {
  useEffect(() => {
    const interval = setInterval(() => {
      fn();
    }, ms);
    return () => clearInterval(interval);
  });
}

import { useEffect, useState } from "react";

export const useObserver = (
  options: MutationObserverInit & { timeout?: number },
  callback: (mutations: MutationRecord[], observer: MutationObserver) => void
) => {
  const [observer] = useState(new MutationObserver(callback));

  useEffect(() => {
    observer.observe(document.body, options);
    setTimeout(() => {
      observer.disconnect();
    }, options.timeout || 10000);
    return () => observer.disconnect();
  }, [observer, options]);
};

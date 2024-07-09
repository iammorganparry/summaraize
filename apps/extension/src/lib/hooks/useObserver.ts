import { useEffect, useState } from "react";

export const useObserver = (
  options: MutationObserverInit,
  callback: (mutations: MutationRecord[], observer: MutationObserver) => void
) => {
  const [observer] = useState(new MutationObserver(callback));

  useEffect(() => {
    observer.observe(document.body, options);

    return () => observer.disconnect();
  }, [observer, options]);
};

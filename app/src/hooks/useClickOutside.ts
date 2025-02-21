import { useEffect, RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  isActive: boolean
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler, isActive]);
}
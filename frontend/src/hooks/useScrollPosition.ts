import { useEffect, useRef } from "react";

export const useScrollPosition = (key: string) => {
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${key}`);
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 100);
    }

    const handleScroll = () => {
      scrollPositionRef.current = window.pageYOffset;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      sessionStorage.setItem(
        `scroll-${key}`,
        scrollPositionRef.current.toString()
      );
      window.removeEventListener("scroll", handleScroll);
    };
  }, [key]);

  const saveScrollPosition = () => {
    sessionStorage.setItem(`scroll-${key}`, window.pageYOffset.toString());
  };

  return { saveScrollPosition };
};

import { useEffect, useState } from "react";

export default function useAtmosphereVisibility(targetRef) {
  const [isActive, setIsActive] = useState(() => document.visibilityState !== "hidden");

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return undefined;

    let isIntersecting = true;
    const updateActiveState = () => {
      setIsActive(isIntersecting && document.visibilityState !== "hidden");
    };

    const handleVisibilityChange = () => updateActiveState();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting;
          updateActiveState();
        },
        {
          rootMargin: "0px",
          threshold: 0.01,
        },
      );
      observer.observe(target);
    }

    updateActiveState();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer?.disconnect();
    };
  }, [targetRef]);

  return isActive;
}

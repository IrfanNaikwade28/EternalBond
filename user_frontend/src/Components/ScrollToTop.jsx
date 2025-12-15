import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "instant" }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, let the browser try to scroll to the anchor after paint
    if (hash) {
      // Small delay to ensure element is present in DOM
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: behavior === "smooth" ? "smooth" : "auto", block: "start" });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: behavior === "smooth" ? "smooth" : "auto" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: behavior === "smooth" ? "smooth" : "auto" });
  }, [pathname, search, hash, behavior]);

  return null;
}

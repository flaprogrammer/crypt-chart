import { useEffect } from "react";

interface UseWindowFocusBlurProps {
  onFocus: () => void;
  onBlur: () => void;
}

export const useWindowFocusBlur = ({
  onFocus,
  onBlur,
}: UseWindowFocusBlurProps) => {
  useEffect(() => {
    const handleFocus = () => {
      onFocus();
    };

    const handleBlur = () => {
      onBlur();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [onFocus, onBlur]);
};

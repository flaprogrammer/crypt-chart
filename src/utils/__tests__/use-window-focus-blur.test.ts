import { renderHook } from "@testing-library/react";
import { useWindowFocusBlur } from "../use-window-focus-blur";

describe("useWindowFocusBlur", () => {
  test("calls onFocus and onBlur callbacks", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    renderHook(() => useWindowFocusBlur({ onFocus, onBlur }));

    // Simulate window focus and blur events
    window.dispatchEvent(new Event("focus"));
    expect(onFocus).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("blur"));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test("removes event listeners on unmount", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { rerender, unmount } = renderHook(() =>
      useWindowFocusBlur({ onFocus, onBlur })
    );

    // Unmount the hook
    unmount();

    // Simulate window focus and blur events
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("blur"));

    expect(onFocus).not.toHaveBeenCalled();
    expect(onBlur).not.toHaveBeenCalled();
  });
});

import { useWindowDimensions } from "react-native";

export type LayoutSize = "compact" | "medium" | "large";
export type LayoutType = "portrait" | "landscape"

const MEDIUM_BREAKPOINT = 700;
const LARGE_BREAKPOINT = 1200;

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const size: LayoutSize =
    width >= LARGE_BREAKPOINT
      ? "large"
      : width >= MEDIUM_BREAKPOINT
        ? "medium"
        : "compact";

  const type: LayoutType =
    width > height
      ? "landscape"
      : "portrait";

  return {
    size,
    type
  };
}
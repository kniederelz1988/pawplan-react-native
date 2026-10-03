import { set } from "date-fns";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

export type LayoutSize = "compact" | "medium" | "large";
export type LayoutType = "portrait" | "landscape"

const MEDIUM_BREAKPOINT = 700;
const LARGE_BREAKPOINT = 1200;

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const [size, setSize] = useState<LayoutSize>("compact")
  const [type, setType] = useState<LayoutType>("portrait")
 
  useEffect(() => {
    if (width >= LARGE_BREAKPOINT)
      setSize("large")
    else if (width >= MEDIUM_BREAKPOINT)
      setSize("medium")
    else
      setSize("compact")

    if (height >= width)
      setType("portrait")
    else
      setType("landscape")
  }, [width, height])

  return {
    size,
    type
  };
}
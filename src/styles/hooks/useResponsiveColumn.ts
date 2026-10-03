import { useMemo } from "react";
import { LayoutSize, LayoutType, useResponsiveLayout } from "./useResponsiveLayout";

export function useResponsiveColumnBasedOnSize(defaultCount: number, counts?: Partial<Record<LayoutSize, number>>) {
    const { size } = useResponsiveLayout()

    return useMemo(() => counts?.[size] ?? defaultCount, [size])
}
export function useResponsiveColumnBasedOnType(defaultCount: number, counts?: Partial<Record<LayoutType, number>>) {
    const { type } = useResponsiveLayout()

    return useMemo(() => counts?.[type] ?? defaultCount, [type])
}
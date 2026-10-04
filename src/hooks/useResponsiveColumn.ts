import { LayoutSize, LayoutType, useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export function useResponsiveColumnBasedOnSize(defaultCount: number, counts?: Partial<Record<LayoutSize, number>>) {
    const { size } = useResponsiveLayout()

    return counts?.[size] ?? defaultCount
}
export function useResponsiveColumnBasedOnType(defaultCount: number, counts?: Partial<Record<LayoutType, number>>) {
    const { type } = useResponsiveLayout()

    return counts?.[type] ?? defaultCount
}
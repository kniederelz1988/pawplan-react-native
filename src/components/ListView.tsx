import type { ReactNode } from "react";

import { StyleProp, View, ViewStyle } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

type ListViewProps<T> = {
    data: readonly T[];
    rowOnly?: boolean,
    numColumns?: number;
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    wrapperStyle?: StyleProp<ViewStyle>,
    keyExtractor: (item: T, index: number) => string;
    renderItem: (item: T, index: number) => ReactNode;
};

export function ListView<T>({ data, rowOnly = false, style, containerStyle, wrapperStyle, numColumns = 1, keyExtractor, renderItem }: ListViewProps<T>) {
    const { layoutStyles } = useResponsiveStyles();

    return (
        <View key={`dogs_${numColumns}`} style={[style]}>
            <View style={[containerStyle]}>
                {Array.from({ length: rowOnly ? 1 : Math.ceil(data.length / numColumns) }, (_, rowIndex) => {
                    const row = rowOnly ? data
                        : data.slice(rowIndex * numColumns, (rowIndex + 1) * numColumns)

                    return (
                        <View key={`row-${rowIndex}`}
                            style={numColumns > 1 && [layoutStyles.defaultRowContainer, wrapperStyle]}
                        >
                            {row.map((item, columnIndex) => {
                                const index = rowIndex * numColumns + columnIndex;

                                return (
                                    <View key={keyExtractor(item, index)} style={{ flex: 1 }} >
                                        {renderItem(item, index)}
                                    </View>
                                );
                            })}
                        </View>
                    );
                }
                )}
            </View>
        </View>
    );
}

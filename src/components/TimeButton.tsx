import { CalendarDateTime } from "@internationalized/date";
import { Pressable, Text } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { getTimeAsString } from "@/domain/utils/TimeHelpers";

type TimeButtonProps = {
    time: CalendarDateTime;
    isDisabled: boolean;
    isSelected: boolean;
    onSubmit: (time: CalendarDateTime) => void;
};
export function TimeButton({ time, isDisabled, isSelected, onSubmit }: TimeButtonProps) {
    const { globalStyles, buttonStyles } = useResponsiveStyles()

    return (
        <Pressable style={[buttonStyles.dateButton, isDisabled && buttonStyles.dateButtonDisabled, isSelected && buttonStyles.dateButtonSelected]}
            accessibilityRole="button"
            accessibilityLabel={`Select ${getTimeAsString(time)}`}
            accessibilityState={{
                selected: isSelected,
                disabled: isDisabled
            }}
            disabled={isDisabled}
            onPress={() => onSubmit(time)}
        >
            <Text style={[buttonStyles.dateButtonContent, globalStyles.textMedium]} accessible={false}>
                {`${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`}
            </Text>
        </Pressable>
    );
}

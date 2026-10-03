import { CalendarDateTime } from "@internationalized/date";
import { Pressable, Text } from "react-native";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

type TimeButtonProps = {
    time: CalendarDateTime;
    isDisabled: boolean;
    isSelected: boolean;
    onSubmit: (time: CalendarDateTime) => void;
};
export function TimeButton({ time, isDisabled, isSelected, onSubmit }: TimeButtonProps) {
    const { globalStyles, buttonStyles } = useResponsiveStyles()

    return (
        <Pressable style={[buttonStyles.dateButton,
        isDisabled && buttonStyles.dateButtonDisabled,
        isSelected && buttonStyles.dateButtonSelected
        ]} disabled={isDisabled} onPress={() => onSubmit(time)}>
            <Text style={[buttonStyles.dateButtonContent, globalStyles.textMedium]}>
                {`${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`}
            </Text>
        </Pressable>
    );
}

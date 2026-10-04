import { Pressable, Text } from "react-native";

import { CalendarDate } from "@internationalized/date";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

type DateButtonProps = {
    date: CalendarDate;
    isDisabled: boolean;
    isSelected: boolean;
    onSubmit: (date: CalendarDate) => void;
};
export function DateButton({ date, isDisabled, isSelected, onSubmit }: DateButtonProps) {
    const { buttonStyles, globalStyles } = useResponsiveStyles()

    return (
        <Pressable style={[buttonStyles.dateButton,
        isDisabled && buttonStyles.dateButtonDisabled,
        isSelected && buttonStyles.dateButtonSelected
        ]} disabled={isDisabled} onPress={() => onSubmit(date)}>
            <Text style={[buttonStyles.dateButtonContent, globalStyles.textMedium]}>
                {`${String(date.day).padStart(2, "0")}.${String(date.month).padStart(2, "0")}`}
            </Text>
            <Text style={[buttonStyles.dateButtonContent, globalStyles.textSmall]}>
                {date.year}
            </Text>
        </Pressable>
    );
}

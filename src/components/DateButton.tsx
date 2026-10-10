import { Text } from "react-native";

import { CalendarDate } from "@internationalized/date";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { dateValueToDate } from "@/domain/utils/TimeHelpers";
import PressableButton from "@/components/PressableButton";

type DateButtonProps = {
    date: CalendarDate,
    state?: {
        checked?: boolean,
        disabled?: boolean,
    },
    onSubmit: (date: CalendarDate) => void
};

export function DateButton({ date, state, onSubmit }: DateButtonProps) {
    const { layoutStyles, buttonStyles, globalStyles } = useResponsiveStyles()

    return (
        <PressableButton
            style={[buttonStyles.dateButton, layoutStyles.defaultColumnContainer, layoutStyles.gapNone]}
            textStyle={{ display: "none" }}
            state={{ checked: state?.checked, disabled: state?.disabled }}
            title={`Select ${dateValueToDate(date).toLocaleDateString()}`}
            onPress={() => onSubmit(date)}
        >
            <Text style={[globalStyles.textMedium, globalStyles.textBold, buttonStyles.defaultText]} accessible={false}>
                {`${String(date.day).padStart(2, "0")}.${String(date.month).padStart(2, "0")}.`}
            </Text>
            <Text style={[globalStyles.textSmall, buttonStyles.defaultText]} accessible={false}>
                {date.year}
            </Text>
        </PressableButton>
    );
}

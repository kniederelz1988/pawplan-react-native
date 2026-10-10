import { CalendarDateTime } from "@internationalized/date"
import { Text } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles"
import { getTimeAsString } from "@/domain/utils/TimeHelpers"
import PressableButton from "./PressableButton"

type TimeButtonProps = {
    time: CalendarDateTime
    state?: {
        checked?: boolean
        disabled?: boolean
    }
    onSubmit: (time: CalendarDateTime) => void
};
export function TimeButton({ time, state, onSubmit }: TimeButtonProps) {
    const { globalStyles, buttonStyles, layoutStyles } = useResponsiveStyles()

    return (
        <PressableButton
            style={[buttonStyles.dateButton, layoutStyles.defaultColumnContainer, layoutStyles.gapNone]}
            textStyle={{ display: "none" }}
            state={{ checked: state?.checked, disabled: state?.disabled }}
            title={`Select ${getTimeAsString(time)}`}
            onPress={() => onSubmit(time)}
        >
            <Text style={[globalStyles.textMedium, buttonStyles.defaultText]} accessible={false}>
                {`${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`}
            </Text>
        </PressableButton>
    );
}

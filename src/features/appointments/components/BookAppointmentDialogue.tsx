import { useMemo, useState } from "react"
import { Button, Pressable, Text, View } from "react-native"

import { CalendarDate, CalendarDateTime } from "@internationalized/date"

import { getDateFromToday, getDateTime, now } from "@/domain/utils/TimeHelpers"
import { Appointment } from "@/domain/Appointment"

import { useAppointmentRepository } from "@/shared/repositories/hooks/AppointmentHooks"
import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks"
import { getRepositoryOperationErrorMessage } from "@/shared/repositories/utils/RepositoryOperationError"

import Divider from "@/components/Divider"
import { Header1, Header2 } from "@/components/Header"
import Space from "@/components/Space"
import { TimeButton } from "@/components/TimeButton"
import { DateButton } from "@/components/DateButton"
import { ListView } from "@/components/ListView"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { useResponsiveColumnBasedOnType } from "@/hooks/useResponsiveColumn"

type AppointmentDialogueProps = {
    dogId?: string,
    onClose: () => void
}

export default function BookAppointmentDialogue({ dogId, onClose }: AppointmentDialogueProps) {
    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    const timeColumnCount = useResponsiveColumnBasedOnType(5, { "portrait": 4 })
    const dateColumnCount = useResponsiveColumnBasedOnType(4, { "portrait": 4 })

    const { volunteer } = useVolunteer()
    const { createAppointment } = useAppointmentRepository()

    const dates = useMemo(() => {
        const dateOffset = [1, 2, 3, 4, 5, 6, 7, 8]
        return dateOffset.map((value) => getDateFromToday(value))
    }, [])
    const [date, setDate] = useState<CalendarDate | null>()

    const times = useMemo(() => {
        const timeSlots = [
            "09:00", "09:30", "10:00", "10:30", "11:00",
            "11:30", "12:00", "12:30", "13:00", "13:30",
            "14:00", "14:30", "15:00", "15:30", "16:00",
            "16:30", "17:00", "17:30", "18:00", "18:30"
        ]
        return timeSlots.map((value) => {
            const [hour, min] = value.split(":")

            return getDateTime(date ? date : getDateFromToday(0),
                parseInt(hour), parseInt(min)
            )
        })
    }, [date])
    const [time, setTime] = useState<CalendarDateTime | null>()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    async function onSubmit() {
        if (!dogId || !time || !volunteer?.id || isSubmitting)
            return

        const appointment: Appointment = {
            dogId: dogId,
            volunteerId: volunteer.id,
            type: "walk",
            date: time,
            createdAt: now()
        }

        try {
            setSubmitError(null)
            setIsSubmitting(true)

            await createAppointment(appointment)
            onClose()
        } catch (error) {
            const message = getRepositoryOperationErrorMessage(error)
            setSubmitError(message ?? "Appointment could not be booked")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Pressable 
            style={[dialogStyles.dialogContainer, layoutStyles.defaultColumnContainer]} 
            accessible={false}
            accessibilityViewIsModal
            onPress={() => {}}
        >
            <Divider>
                <Header1>Choose a date</Header1>
            </Divider>

            <Divider>
                <Header2>Date</Header2>
            </Divider>

            <ListView
                key={`dates_${dateColumnCount}`}
                data={dates}
                style={[layoutStyles.list]} containerStyle={[layoutStyles.listContainer]} wrapperStyle={[layoutStyles.listWrapper]}
                rowOnly={false}
                numColumns={dateColumnCount}
                keyExtractor={(item) => item.toString()}
                renderItem={(item) => <DateButton
                    isDisabled={false}
                    isSelected={item === date}
                    date={item}
                    onSubmit={setDate}
                />}
            />

            <Divider>
                <Header2>Time</Header2>
            </Divider>

            <ListView
                key={`time_${timeColumnCount}`}
                data={times}
                style={[layoutStyles.list]} containerStyle={[layoutStyles.listContainer]} wrapperStyle={[layoutStyles.listWrapper]}
                rowOnly={false}
                numColumns={timeColumnCount}
                keyExtractor={(item) => item.toString()}
                renderItem={(item) => <TimeButton
                    isDisabled={!date}
                    isSelected={item === time}
                    time={item}
                    onSubmit={setTime}
                />}
            />

            {submitError && (
                <Text
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                >
                    {submitError}
                </Text>
            )}

            <Space />
            <Space />
            <Space />

            <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                <Button title="Cancel" color={"grey"} onPress={onClose} />

                <Space />

                <Button
                    title={isSubmitting ? "Submitting..." : "Submit"}
                    disabled={!time || !volunteer?.id || isSubmitting}
                    accessibilityState={{
                        disabled: !time || !volunteer?.id || isSubmitting,
                        busy: isSubmitting
                    }}
                    onPress={onSubmit}
                />
            </View>
        </Pressable>
    )
}
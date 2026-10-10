import { fireEvent, render, screen, waitFor } from "@testing-library/react-native"
import { CalendarDate } from "@internationalized/date"

import BookAppointmentDialogue from "@/features/appointments/components/BookAppointmentDialogue"
import { useAppointmentRepository } from "@/shared/repositories/hooks/AppointmentHooks"
import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks"

jest.mock("lucide-react-native", () => ({
    Send: () => null,
    X: () => null,
}))

jest.mock("@/shared/repositories/hooks/AppointmentHooks", () => ({
    useAppointmentRepository: jest.fn(),
}))

jest.mock("@/shared/repositories/hooks/VolunteerHooks", () => ({
    useVolunteer: jest.fn(),
}))

const mockedUseAppointmentRepository = jest.mocked(useAppointmentRepository)
const mockedUseVolunteer = jest.mocked(useVolunteer)

function setupHooks(createAppointment = jest.fn().mockResolvedValue("appointment-029")) {
    mockedUseAppointmentRepository.mockReturnValue({
        createAppointment,
        updateAppointment: jest.fn(),
        deleteAppointment: jest.fn(),
        updateStatus: jest.fn(),
        createRating: jest.fn(),
        updateRating: jest.fn(),
    })
    mockedUseVolunteer.mockReturnValue({
        volunteer: {
            id: "volunteer-001",
            userId: "user-001",
            name: "Alex Morgan",
            birthday: new CalendarDate(1992, 4, 15),
            volunteerSince: new CalendarDate(2022, 9, 1),
        },
        isFavourite: () => false,
        toggleFavourite: jest.fn(),
        likeCounter: 0,
    })

    return createAppointment
}

async function selectDateAndTime() {
    await fireEvent.press(screen.getAllByRole("button")[0])
    await fireEvent.press(
        screen.getByRole("button", {
            name: /select 9:00/i,
        })
    )
}

it("starts with submit disabled", async () => {
    setupHooks()

    await render(
        <BookAppointmentDialogue
            dogId="dog-002"
            onClose={jest.fn()}
        />
    )

    expect(
        screen.getByRole("button", {
            name: "Submit"
        })
    ).toBeDisabled()
})

it("enables submit after choosing date and time", async () => {
    setupHooks()

    await render(
        <BookAppointmentDialogue
            dogId="dog-002"
            onClose={jest.fn()}
        />
    )

    await selectDateAndTime()

    expect(
        screen.getByRole("button", {
            name: "Submit"
        })
    ).toBeEnabled()
})

it("closes after appointment creation succeeds", async () => {
    const createAppointment = setupHooks()

    const onClose = jest.fn()

    await render(
        <BookAppointmentDialogue
            dogId="dog-002"
            onClose={onClose}
        />
    )

    await selectDateAndTime()

    await fireEvent.press(
        screen.getByRole("button", {
            name: "Submit"
        })
    )

    await waitFor(() => {
        expect(createAppointment).toHaveBeenCalledTimes(1)
    })

    expect(onClose).toHaveBeenCalledTimes(1)
})

it("keeps the dialog open and shows an error when creation fails", async () => {
    const createAppointment = setupHooks(
        jest.fn().mockRejectedValue(new Error("Appointment could not be created"))
    )

    const onClose = jest.fn()

    await render(
        <BookAppointmentDialogue
            dogId="dog-002"
            onClose={onClose}
        />
    )

    await selectDateAndTime()

    await fireEvent.press(
        screen.getByRole("button", {
            name: "Submit"
        })
    )

    const alert = await screen.findByRole("alert")

    expect(alert).toHaveTextContent(/appointment/i)
    expect(onClose).not.toHaveBeenCalled()
})
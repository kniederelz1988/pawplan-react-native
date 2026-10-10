import { fireEvent, waitFor } from "@testing-library/react-native"
import { renderRouter } from "expo-router/testing-library"

import { dateValueToDate, getDateFromToday, getDateTime, getTimeAsString } from "@/domain/utils/TimeHelpers"

jest.mock("lucide-react-native", () => ({
    Dog: () => null,
    Heart: () => null,
    Calendar: () => null,
    LogIn: () => null,
    LogOut: () => null,
    Mars: () => null,
    Menu: () => null,
    PawPrint: () => null,
    Send: () => null,
    Star: () => null,
    Venus: () => null,
    X: () => null,
}))

async function openBookingForLuna() {
    const router = renderRouter(
        {
            appDir: "./src/app",
            overrides: {},
        },
        {
            initialUrl: "/dogs/details?dogId=dog-002",
        }
    )
    const screen = await router

    expect(
        await screen.findByRole("button", {
            name: "Book an appointment with Luna"
        })
    ).toBeTruthy()

    await fireEvent.press(
        screen.getByRole("button", {
            name: "Book an appointment with Luna"
        })
    )

    await waitFor(() => {
        expect(router.getPathname()).toBe("/auth/login")
    })

    await fireEvent.press(
        screen.getByRole("button", {
            name: "Log in"
        })
    )

    await waitFor(() => {
        expect(router.getPathname()).toBe("/appointments/book")
    })

    expect(router.getSearchParams()).toMatchObject({
        dogId: "dog-002",
        intent: "/appointments/book",
        source: "dogs/details",
    })

    return { router, screen }
}

describe("booking flow", () => {
    it("preserves the dog when returning from login to booking", async () => {
        await openBookingForLuna()
    })
})

describe("booking navigation flow", () => {
    it("returns to the dog details page after successfully booking", async () => {
        const { router, screen } = await openBookingForLuna()

        const date = getDateFromToday(1)
        const dateLabel = `Select ${dateValueToDate(date).toLocaleDateString()}`

        await fireEvent.press(
            screen.getByRole("button", {
                name: dateLabel
            })
        )

        const time = getDateTime(date, 9, 0)
        const timeLabel = `Select ${getTimeAsString(time)}`

        await fireEvent.press(
            screen.getByRole("button", {
                name: timeLabel
            })
        )

        const submitButton = screen.getByRole("button", {
            name: "Submit"
        })

        expect(submitButton).toBeEnabled()

        await fireEvent.press(submitButton)

        await waitFor(() => {
            expect(router.getPathname()).toBe("/dogs/details")
        })

        expect(router.getSearchParams()).toMatchObject({
            dogId: "dog-002"
        })

        expect(
            await screen.findByRole("header", {
                name: "Luna"
            })
        ).toBeTruthy()
    })

    it("returns to the dog details page when booking is cancelled", async () => {
        const { router, screen } = await openBookingForLuna()

        await waitFor(() => {
            expect(router.getPathname()).toBe("/appointments/book")
        })

        await fireEvent.press(
            screen.getByRole("button", {
                name: "Cancel"
            })
        )

        await waitFor(() => {
            expect(router.getPathname()).toBe("/dogs/details")
        })

        expect(router.getSearchParams()).toMatchObject({
            dogId: "dog-002"
        })

        expect(
            await screen.findByRole("header", {
                name: "Luna"
            })
        ).toBeTruthy()
    })

    it("returns to the dog details page when login is cancelled", async () => {
        const router = renderRouter(
            {
                appDir: "./src/app",
                overrides: {},
            },
            {
                initialUrl: "/dogs/details?dogId=dog-002",
            }
        )
        const screen = await router

        await fireEvent.press(
            await screen.findByRole("button", {
                name: "Book an appointment with Luna"
            })
        )

        await waitFor(() => {
            expect(router.getPathname()).toBe("/auth/login")
        })

        await fireEvent.press(
            screen.getByRole("button", {
                name: "Cancel"
            })
        )

        await waitFor(() => {
            expect(router.getPathname()).toBe("/dogs/details")
        })

        expect(router.getSearchParams()).toMatchObject({
            dogId: "dog-002"
        })
    })
})
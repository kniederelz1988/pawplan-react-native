// __tests__/navigation/BookingAuthFlow.test.tsx

import {
    fireEvent,
    waitFor
} from "@testing-library/react-native"

import {
    renderRouter
} from "expo-router/testing-library"

jest.mock("lucide-react-native", () => ({
    Dog: () => null,
    Heart: () => null,
    Mars: () => null,
    Star: () => null,
    Venus: () => null,
}))

describe("booking authentication flow", () => {
    it("returns to booking after login", async () => {
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
            await screen.findByRole("header", {
                name: "Luna"
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

        expect(
            screen.getByRole("header", {
                name: "Log in"
            })
        ).toBeTruthy()

        await fireEvent.press(
            screen.getByRole("button", {
                name: "Log in"
            })
        )

        await waitFor(() => {
            expect(router.getPathname()).toBe("/appointments/book")
        })

        expect(
            await screen.findByRole("header", {
                name: "Choose a date"
            })
        ).toBeTruthy()
    })
})
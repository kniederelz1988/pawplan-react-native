import { fireEvent, render, screen } from "@testing-library/react-native"
import { CalendarDate } from "@internationalized/date"

import { DateButton } from "@/components/DateButton"

describe("DateButton", () => {
    const date = new CalendarDate(2026, 10, 8)

    it("calls onSubmit with its date when pressed", async () => {
        const onSubmit = jest.fn()

        await render(
            <DateButton
                date={date}
                isDisabled={false}
                isSelected={false}
                onSubmit={onSubmit}
            />
        )

        const button = screen.getByRole("button")

        fireEvent.press(button)

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit).toHaveBeenCalledWith(date)
    })

    it("exposes selected state", async () => {
        await render(
            <DateButton
                date={date}
                isDisabled={false}
                isSelected
                onSubmit={jest.fn()}
            />
        )

        const button = screen.getByRole("button")
        expect(button).toBeSelected()
        expect(button).toBeEnabled()
    })

    it("cannot be pressed when disabled", async () => {
        const onSubmit = jest.fn()

        await render(
            <DateButton
                date={date}
                isDisabled
                isSelected={false}
                onSubmit={onSubmit}
            />
        )

        fireEvent.press(screen.getByRole("button"))

        expect(onSubmit).not.toHaveBeenCalled()
    })
})
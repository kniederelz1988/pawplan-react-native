import { fireEvent, render, screen } from "@testing-library/react-native"
import { CalendarDateTime } from "@internationalized/date"

import { TimeButton } from "@/components/TimeButton"

describe("TimeButton", () => {
    it("calls onSubmit with its represented time", async () => {
        const time = new CalendarDateTime(2026, 10, 8, 9, 30)
        const onSubmit = jest.fn()

        await render(
            <TimeButton
                time={time}
                isDisabled={false}
                isSelected={false}
                onSubmit={onSubmit}
            />
        )

        fireEvent.press(
            screen.getByRole("button", {
                name: /Select.*9.*30/i
            })
        )

        expect(onSubmit).toHaveBeenCalledWith(time)
    })

    it("exposes selected state", async () => {
        const time = new CalendarDateTime(2026, 10, 8, 9, 30)

        await render(
            <TimeButton
                time={time}
                isDisabled={false}
                isSelected
                onSubmit={jest.fn()}
            />
        )

        expect(screen.getByRole("button")).toBeSelected()
    })

    it("exposes disabled state", async () => {
        const time = new CalendarDateTime(2026, 10, 8, 9, 30)

        await render(
            <TimeButton
                time={time}
                isDisabled
                isSelected={false}
                onSubmit={jest.fn()}
            />
        )

        expect(screen.getByRole("button")).toBeDisabled()
    })
})
import { fireEvent, render, screen } from "@testing-library/react-native"
import { CalendarDate } from "@internationalized/date"

import { DogCard } from "@/features/dogs/components/DogOverview"

import useNavigation, { Operations } from "@/hooks/useNavigation"
import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks"

jest.mock("@/hooks/useNavigation", () => ({
    __esModule: true,
    default: jest.fn(),
    Operations: { Clear: { operation: "clear" } },
}))

jest.mock("@/shared/repositories/hooks/VolunteerHooks", () => ({
    useVolunteer: jest.fn(),
}))

jest.mock("lucide-react-native", () => ({
    Dog: () => null,
    Heart: () => null,
    Mars: () => null,
    PawPrint: () => null,
    Venus: () => null,
}))

const mockedUseNavigation = jest.mocked(useNavigation)
const mockedUseVolunteer = jest.mocked(useVolunteer)

describe("DogCard", () => {
    it("opens dog details", async () => {
        const push = jest.fn(() => true)

        mockedUseNavigation.mockReturnValue({
            push
        } as any)

        mockedUseVolunteer.mockReturnValue({
            volunteer: null,
            isFavourite: jest.fn(),
            toggleFavourite: jest.fn(),
            likeCounter: 0
        })

        const dog = {
            id: "dog-002",
            name: "Luna",
            birthday: new CalendarDate(2020, 4, 12),
            imageURL: "https://example.com/luna.jpg",
            gender: "female",
            size: "mid"
        } as any

        await render(<DogCard dog={dog} />)

        fireEvent.press(
            screen.getByRole("button", {
                name: "View details for Luna"
            })
        )

        expect(push).toHaveBeenCalledWith(
            "/dogs/details",
            Operations.Clear,
            { dogId: "dog-002" }
        )
    })
})
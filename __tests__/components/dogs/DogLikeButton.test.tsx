import { fireEvent, render, screen } from "@testing-library/react-native"

import DogLikeButton from "@/features/dogs/components/DogLikeButton"

import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks"

const dog = {
    id: "dog-002",
    name: "Luna"
} as any

jest.mock("@/shared/repositories/hooks/VolunteerHooks", () => ({
    useVolunteer: jest.fn(),
}))

jest.mock("lucide-react-native", () => ({
    Heart: () => null,
}))

const mockedUseVolunteer = jest.mocked(useVolunteer)

describe("DogLikeButton", () => {
    it("offers to add a dog that is not a favourite", async () => {
        mockedUseVolunteer.mockReturnValue({
            volunteer: null,
            isFavourite: () => false,
            toggleFavourite: jest.fn(),
            likeCounter: 0
        })

        await render(
            <DogLikeButton
                data={dog}
                style={{}}
            />
        )

        const button = screen.getByRole("button", {
            name: "Add Luna to favourites"
        })

        expect(button).not.toBeSelected()
    })

    it("offers to remove a favourite dog", async () => {
        mockedUseVolunteer.mockReturnValue({
            volunteer: null,
            isFavourite: () => true,
            toggleFavourite: jest.fn(),
            likeCounter: 1
        })

        await render(
            <DogLikeButton
                data={dog}
                style={{}}
            />
        )

        const button = screen.getByRole("button", {
            name: "Remove Luna from favourites"
        })

        expect(button).toBeSelected()
    })

    it("toggles the dog when pressed", async () => {
        const toggleFavourite = jest.fn()

        mockedUseVolunteer.mockReturnValue({
            volunteer: null,
            isFavourite: () => false,
            toggleFavourite,
            likeCounter: 0
        })

        await render(
            <DogLikeButton
                data={dog}
                style={{}}
            />
        )

        fireEvent.press(
            screen.getByRole("button", {
                name: "Add Luna to favourites"
            })
        )

        expect(toggleFavourite).toHaveBeenCalledWith(dog)
    })
})
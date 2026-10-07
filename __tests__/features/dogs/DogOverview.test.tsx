import { render, screen } from "@testing-library/react-native"

import DogOverview from "@/features/dogs/components/DogOverview"

import { AppDependenciesProvider } from "@/shared/dependencies/AppDependenciesProvider"
import { AuthContextProvider } from "@/shared/auth/contexts/AuthContextProvider"

import { AppDependencies } from "@/shared/dependencies/AppDependencies"

import MockAuthRepository from "@/mock/repositories/MockAuthRepository"
import MockAppointmentRepository from "@/mock/repositories/MockAppointmentRepository"
import MockDogRepository from "@/mock/repositories/MockDogRepository"
import MockVolunteerRepository from "@/mock/repositories/MockVolunteerRepository"
import MockVolunteerDogLikesRepository from "@/mock/repositories/MockVolunteerDogLikesRepository"

import useNavigation from "@/hooks/useNavigation"

jest.mock("@/hooks/useNavigation", () => {
    return {
        __esModule: true,
        default: jest.fn(),
        Operations: {
            Clear: { operation: "clear" },
        },
    }
})

jest.mock("lucide-react-native", () => ({
    Dog: () => null,
    Heart: () => null,
    Mars: () => null,
    Venus: () => null,
}))

const mockedUseNavigation = jest.mocked(useNavigation)

function createTestDependencies(): AppDependencies {
    return {
        authRepository: MockAuthRepository(),
        appointmentRepository: MockAppointmentRepository(),
        dogRepository: MockDogRepository(),
        volunteerRepository: MockVolunteerRepository(),
        volunteerLikesRepository: MockVolunteerDogLikesRepository()
    }
}

describe("DogOverview repository integration", () => {
    beforeEach(() => {
        const push = jest.fn(() => true)

        mockedUseNavigation.mockReturnValue({
            parameters: {},
            push,
            replace: jest.fn(() => true),
            dismiss: jest.fn(() => true),
            back: jest.fn(() => true),
            toIntent: jest.fn(() => true),
            toSource: jest.fn(() => true),
        })
    })

    it("renders dogs supplied by the dog repository", async () => {
        await render(
            <AppDependenciesProvider
                dependencies={createTestDependencies()}
            >
                <AuthContextProvider>
                    <DogOverview />
                </AuthContextProvider>
            </AppDependenciesProvider>
        )

        expect(
            await screen.findByRole("button", {
                name: "View details for Biscuit"
            })
        ).toBeTruthy()

        expect(
            screen.getByRole("button", {
                name: "View details for Luna"
            })
        ).toBeTruthy()
    })

    it("renders all dogs from the mock repository", async () => {
        await render(
            <AppDependenciesProvider
                dependencies={createTestDependencies()}
            >
                <AuthContextProvider>
                    <DogOverview />
                </AuthContextProvider>
            </AppDependenciesProvider>
        )

        const detailButtons = await screen.findAllByRole(
            "button",
            {
                name: /view details for/i
            }
        )

        expect(detailButtons).toHaveLength(10)
    })

    it("shows the repository result count", async () => {
        await render(
            <AppDependenciesProvider
                dependencies={createTestDependencies()}
            >
                <AuthContextProvider>
                    <DogOverview />
                </AuthContextProvider>
            </AppDependenciesProvider>
        )

        expect(
            await screen.findByText(/10 dogs found/i)
        ).toBeTruthy()
    })
})
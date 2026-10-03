import { PropsWithChildren, createContext, useMemo } from "react";

import type { AppDependencies } from "./AppDependencies";

import MockAuthRepository from "@/mock/repositories/MockAuthRepository";
import MockAppointmentRepository from "@/mock/repositories/MockAppointmentRepository";
import MockDogRepository from "@/mock/repositories/MockDogRepository";
import MockVolunteerRepository from "@/mock/repositories/MockVolunteerRepository";
import MockVolunteerDogLikesRepository from "@/mock/repositories/MockVolunteerDogLikesRepository";

export const AppDependenciesContext = createContext<AppDependencies | null>(null)

interface Props extends PropsWithChildren {}

export function AppDependenciesProvider({ children }: Props) {
    const dependencies = useMemo<AppDependencies>(() => {
        return {
            authRepository: MockAuthRepository(),
            appointmentRepository: MockAppointmentRepository(),
            dogRepository: MockDogRepository(),
            volunteerRepository: MockVolunteerRepository(),
            volunteerLikesRepository: MockVolunteerDogLikesRepository()
        }
    }, [])

    return (
        <AppDependenciesContext.Provider value={dependencies}>
            {children}
        </AppDependenciesContext.Provider>
    );
}


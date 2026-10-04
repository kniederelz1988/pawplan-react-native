import { PropsWithChildren, createContext, useMemo } from "react";

import { AppDependencies } from "@/shared/dependencies/AppDependencies";

import MockAuthRepository from "@/mock/repositories/MockAuthRepository";
import MockAppointmentRepository from "@/mock/repositories/MockAppointmentRepository";
import MockDogRepository from "@/mock/repositories/MockDogRepository";
import MockVolunteerRepository from "@/mock/repositories/MockVolunteerRepository";
import MockVolunteerDogLikesRepository from "@/mock/repositories/MockVolunteerDogLikesRepository";

export const AppDependenciesContext = createContext<AppDependencies | undefined>(undefined)

function createDefaultDependencies(): AppDependencies {
  return {
    authRepository: MockAuthRepository(),
    appointmentRepository: MockAppointmentRepository(),
    dogRepository: MockDogRepository(),
    volunteerRepository: MockVolunteerRepository(),
    volunteerLikesRepository: MockVolunteerDogLikesRepository(),
  };
}

interface Props extends PropsWithChildren {
    dependencies?: AppDependencies
}

export function AppDependenciesProvider({ children, dependencies }: Props) {
    const defaultDependencies = useMemo(() => createDefaultDependencies(), [])

    const value = dependencies ?? defaultDependencies

    return (
        <AppDependenciesContext.Provider value={value}>
            {children}
        </AppDependenciesContext.Provider>
    );
}


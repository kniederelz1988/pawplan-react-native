
import { Volunteer } from "@/shared/data/Volunteer";
import { VolunteerRole } from "@/shared/data/VolunteerRole";
import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";

export type VolunteerRepositoryListener = (result: Volunteer[]) => void
export type VolunteerRoleRepositoryListener = (result: VolunteerRole) => void

type Unsubscribe = () => void


export default interface VolunteerRepository {
    subscribeForAllVolunteers(
        queryCursor: Volunteer | null,
        queryLimit: number,
        listener: VolunteerRepositoryListener
    ): Unsubscribe;

    subscribeForVolunteerByUserId(
        userId: string,
        listener: VolunteerRepositoryListener
    ): Unsubscribe;

    subscribeForVolunteer(
        volunteerId: string,
        listener: VolunteerRepositoryListener
    ): Unsubscribe;

    subscribeForVolunteerRole(
        volunteerId: string,
        listener: VolunteerRoleRepositoryListener
    ): Unsubscribe;

    createVolunteer(
        volunteer: Volunteer,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>;

    updateVolunteer(
        volunteer: Volunteer,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>;

    updateVolunteerRole(
        volunteer: Volunteer,
        role: VolunteerRole,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>;

    deleteVolunteer(
        volunteer: Volunteer,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>;

    createVolunteerIfNonExistant(
        userID: string,
        name: string,
        operationCallback: RepositoryOperationCallback
    ): void;
}

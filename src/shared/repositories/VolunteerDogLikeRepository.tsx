import { Dog } from "@/shared/data/Dog";
import { Volunteer } from "@/shared/data/Volunteer";
import { VolunteerDogLike } from "@/shared/data/VolunteerDogLike";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";

export type VolunteerDogLikesRepositoryListener = (result: VolunteerDogLike[]) => void

type FavoritesUnsubscribe = () => void

export default interface VolunteerDogLikeRepository {
    subscribeForVolunteerLikes(
        volunteerId: string,
        listener: VolunteerDogLikesRepositoryListener
    ): FavoritesUnsubscribe

    subscribeForDogLikes(
        dogId: string,
        listener: VolunteerDogLikesRepositoryListener
    ): FavoritesUnsubscribe

    addLike(
        volunteer: Volunteer,
        dog: Dog,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>

    removeLike(
        volunteer: Volunteer,
        dog: Dog,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>
}

import { Dog } from "@/shared/data/Dog";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";

export type DogRepositoryListener = (dogs: Dog[]) => void

type Unsubscribe = () => void

export default interface DogRepository {
    subscribeForAllDogs(listener: DogRepositoryListener): Unsubscribe;
    subscribeForDogs(dogIds: string[], listener: DogRepositoryListener): Unsubscribe;

    createDog(dog: Dog, operationCallback: RepositoryOperationCallback): Promise<void>;
    updateDog(dog: Dog, operationCallback: RepositoryOperationCallback): Promise<void>;
}

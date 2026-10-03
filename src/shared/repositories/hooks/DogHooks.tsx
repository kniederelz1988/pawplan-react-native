import { useEffect, useState } from "react";

import { useAppDependencies } from "@/shared/dependencies/hooks/useAppDependencies";

import { Dog } from "@/shared/data/Dog";

import { showCreateDogFailedToast, showCreateDogSuccessToast, showDogUpdateFailedToast, showDogUpdateSuccessToast } from "@/services/toast/toastEvents";

export function useDogRepository() {
    const { dogRepository } = useAppDependencies()

    function createDog(dog: Dog) {
        dogRepository.createDog(dog, (state, result) => {
            switch (state) {
                case "success":
                    showCreateDogSuccessToast()
                    return;
                case "error":
                    showCreateDogFailedToast(result)
                    return;
            }
        })
    }

    function updateDog(dog: Dog) {
        dogRepository.updateDog(dog, (state, result) => {
            switch (state) {
                case "success":
                    showDogUpdateSuccessToast()
                    return;
                case "error":
                    showDogUpdateFailedToast(result)
                    return;
            }
        })
    }

    return { createDog, updateDog }
}

export default function useDogsCollection(dogIds: string[] | null) {
    const { dogRepository } = useAppDependencies()

    const [dogs, setDogs] = useState<Dog[]>([])    
    const [filterByIds, filterDogsByIds] = useState(dogIds)

    useEffect(() => {
        if (!filterByIds || filterByIds.length === 0) {
            return dogRepository.subscribeForAllDogs((dogs) => {
                setDogs(dogs)
            })
        }

        return dogRepository.subscribeForDogs(filterByIds, (dogs) => {
            setDogs(dogs)
        })
    }, [filterByIds, dogRepository])

    return { dogs, filterDogsByIds }
}
export function useDogLikeCount() {
    const { volunteerLikesRepository } = useAppDependencies()

    const [dog, setDog] = useState<Dog | null>(null)
    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        if (!dog?.id)
            return

        return volunteerLikesRepository.subscribeForDogLikes(dog.id, (r) => {
            setLikeCount(r.length)
        })
    }, [dog, volunteerLikesRepository])

    return { count: likeCount, for: setDog }
}
export function useDogAppointmentCount() {
    const { appointmentRepository } = useAppDependencies()

    const [dog, setDog] = useState<Dog | null>(null)
    const [appointmentCount, setAppointmentCount] = useState(0)

    useEffect(() => {
        if (!dog?.id)
            return

        return appointmentRepository.subscribeForAllDogAppointments(dog.id, (r) => {
            setAppointmentCount(r.size)
        })
    }, [dog, appointmentRepository])

    return { count: appointmentCount, for: setDog }
}
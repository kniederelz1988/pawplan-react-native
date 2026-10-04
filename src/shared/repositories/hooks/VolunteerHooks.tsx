import { useCallback, useEffect, useMemo, useState } from "react"
import { usePages } from "@/shared/repositories/hooks/GenericHooks"
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider"

import { useAppDependencies } from "@/shared/dependencies/hooks/useAppDependencies"

import { Dog } from "@/domain/Dog"
import { Volunteer } from "@/domain/Volunteer"
import { VolunteerRole } from "@/domain/VolunteerRole"
import { VolunteerRoleEnum } from "@/domain/enums/VolunteerRoleEnum"
import { showAddLikeFailedToast, showCreateVolunteerFailedToast, showCreateVolunteerSuccessToast, showDeleteVolunteerFailedToast, showDeleteVolunteerSuccessToast, showRemoveLikeFailedToast, showUpdateVolunteerFailedToast, showUpdateVolunteerSuccessToast } from "@/services/toast/toastEvents"

export function useVolunteerRepository() {
    const { volunteerRepository } = useAppDependencies()

    function createVolunteer(userID: string, name: string) {
        volunteerRepository.createVolunteerIfNonExistant(userID, name, (state, result) => {
            switch (state) {
                case "success":
                    showCreateVolunteerSuccessToast()
                    return;
                case "error":
                    showCreateVolunteerFailedToast(result)
                    return;
            }
        })
    }

    function updateVolunteer(volunteer: Volunteer) {
        volunteerRepository.updateVolunteer(volunteer, (state, result) => {
            switch (state) {
                case "success":
                    showUpdateVolunteerSuccessToast()
                    return;
                case "error":
                    showUpdateVolunteerFailedToast(result)
                    return;
            }
        })
    }
    function updateVolunteerRole(volunteer: Volunteer, role: VolunteerRole) {
        volunteerRepository.updateVolunteerRole(volunteer, role, (state, result) => {
            switch (state) {
                case "success":
                    showUpdateVolunteerSuccessToast()
                    return;
                case "error":
                    showUpdateVolunteerFailedToast(result)
                    return;
            }
        })
    }
    function deleteVolunteer(volunteer: Volunteer) {
        volunteerRepository.deleteVolunteer(volunteer, (state, result) => {
            switch (state) {
                case "success":
                    showDeleteVolunteerSuccessToast()
                    return;
                case "error":
                    showDeleteVolunteerFailedToast()
                    return;
            }
        })
    }

    return { createVolunteer, updateVolunteer, updateVolunteerRole, deleteVolunteer }
}

export function useVolunteer() {
    const { volunteerRepository, volunteerLikesRepository } = useAppDependencies()

    const { isLoggedIn, user } = useAuthContext()

    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [likedDogs, setLikedDogs] = useState<string[]>([])

    const isFavourite = useCallback((dog: Dog) => {
        if (!dog?.id)
            return false

        return likedDogs.some(t => t === dog.id)
    }, [likedDogs])

    const toggleFavourite = useCallback((dog: Dog) => {
        if (!volunteer || !dog?.id)
            return

        if (!isFavourite(dog)) {
            volunteerLikesRepository.addLike(volunteer, dog, (state, result) => {
                switch (state) {
                    case "error":
                        showAddLikeFailedToast(result)
                        return;
                }
            })
        } else {
            volunteerLikesRepository.removeLike(volunteer, dog, (state, result) => {
                switch (state) {
                    case "error":
                        showRemoveLikeFailedToast(result)
                        return;
                }
            })
        }
    }, [volunteer, isFavourite, volunteerLikesRepository])

    useEffect(() => {
        if (!isLoggedIn || !user?.userId) {
            return
        }

        return volunteerRepository.subscribeForVolunteerByUserId(user?.userId, (t) => {
            if (!t.length) {
                setVolunteer(null)
                return
            }

            setVolunteer(t[0])
        })
    }, [isLoggedIn, user?.userId, volunteerRepository])

    useEffect(() => {
        if (!volunteer?.id)
            return

        return volunteerLikesRepository.subscribeForVolunteerLikes(volunteer.id, (m) => setLikedDogs(m.map(m => m.dogId)))
    }, [volunteer, volunteerLikesRepository])

    const likeCounter = useMemo(() => likedDogs.length, [likedDogs])

    return { volunteer, isFavourite, toggleFavourite, likeCounter }
}
export function useVolunteerRole(volunteer: Volunteer | null) {
    const { volunteerRepository } = useAppDependencies()

    const [role, setRole] = useState<VolunteerRoleEnum>("observer")

    useEffect(() => {
        if (!volunteer?.id) {
            return
        }

        return volunteerRepository.subscribeForVolunteerRole(volunteer.id, (r) => {
            setRole(r.role)
        })
    }, [volunteer, volunteerRepository])

    return role
}

export function useVolunteerById(id: string | null) {
    const { volunteerRepository } = useAppDependencies()

    const [volunteerId, setVolunteerId] = useState(id)
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)

    useEffect(() => {
        if (!volunteerId) {
            return
        }

        return volunteerRepository.subscribeForVolunteer(volunteerId, (t) => {
            if (!t.length) {
                setVolunteer(null)
                return
            }

            setVolunteer(t[0])
        })
    }, [volunteerId, volunteerRepository])

    return { volunteer, forId: setVolunteerId }
}

export function useVolunteerCollection(elementLimit: number) {
    const { volunteerRepository } = useAppDependencies()

    const [volunteers, setVolunteers] = useState<Volunteer[]>([])
    const { page, pageControls, pageCursor } = usePages<Volunteer>()

    useEffect(() => {
        const cursor = pageCursor.get()
        return volunteerRepository.subscribeForAllVolunteers(cursor, elementLimit, (result) => {
            if (!result?.length) {
                setVolunteers([])
                return
            }

            setVolunteers(result)

            if (result.length >= elementLimit) {
                pageCursor.set(result[result.length - 1])
            }
        })
    }, [page, elementLimit, pageCursor, volunteerRepository])

    return { volunteers, page, ...pageControls }
}
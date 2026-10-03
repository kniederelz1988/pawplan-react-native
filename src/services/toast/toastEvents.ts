import { toastAdapter } from "./toastAdapter"

export function showCreateDogSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Dog succesfully added"
  })
}
export function showCreateDogFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Dog couldn't be added",
    message: `Error: ${error}`
  })
}

export function showDogUpdateSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Dog succesfully updated"
  })
}
export function showDogUpdateFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Dog couldn't be updated",
    message: `Error: ${error}`
  })
}

export function showCreateAppointmentSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Visit succesfully created",
    message: "Please wait for the visit to be confirmed."
  })
}
export function showCreateAppointmentFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Visit could not be created",
    message: `Error: ${error}`
  })
}

export function showUpdateAppointmentSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Visit succesfully created"
  })
}
export function showUpdateAppointmentFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Visit could not be created",
    message: `Error: ${error}`
  })
}

export function showDeleteAppointmentSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Visit succesfully created"
  })
}
export function showDeleteAppointmentFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Visit could not be created",
    message: `Error: ${error}`
  })
}


export function showUpdateStatusSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Visit status succesfully updated"
  })
}
export function showUpdateStatusFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Visit status could not be updated",
    message: `Error: ${error}`
  })
}

export function showCreateRatingSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Visit status succesfully updated"
  })
}
export function showCreateRatingFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Visit status could not be updated",
    message: `Error: ${error}`
  })
}

export function showUpdateRatingSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Visit status succesfully updated"
  })
}
export function showUpdateRatingFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Visit status could not be updated",
    message: `Error: ${error}`
  })
}


export function showCreateVolunteerSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Volunteer succesfully created"
  })
}
export function showCreateVolunteerFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Volunteer could not be created",
    message: `Error: ${error}`
  })
}

export function showUpdateVolunteerSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Volunteer succesfully updated"
  })
}
export function showUpdateVolunteerFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Volunteer could not be updated",
    message: `Error: ${error}`
  })
}

export function showUpdateVolunteerRoleSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Volunteer role succesfully updated"
  })
}
export function showUpdateVolunteerRoleFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Volunteer role could not be updated",
    message: `Error: ${error}`
  })
}

export function showDeleteVolunteerSuccessToast(): void {
  toastAdapter.show({
    type: "success",
    title: "Volunteer succesfully deleted"
  })
}
export function showDeleteVolunteerFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Volunteer could not be deleted",
    message: `Error: ${error}`
  })
}


export function showAddLikeFailedToast(result: string | undefined): void {
    toastAdapter.show({
        type: "error",
        title: "Like could not be added",
        message: `Error: ${result}`
    })
}
export function showRemoveLikeFailedToast(error?: string): void {
  toastAdapter.show({
    type: "error",
    title: "Volunteer could not be deleted",
    message: `Error: ${error}`
  })
}

export function hideToast(): void {
  toastAdapter.hide()
}
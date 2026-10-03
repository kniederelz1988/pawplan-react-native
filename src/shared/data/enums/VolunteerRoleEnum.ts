export type VolunteerRoleEnum = "observer" | "volunteer" | "admin"

export function getVolunteerRoleTitle(role: VolunteerRoleEnum) {
    switch (role) {
        case "observer":
            return "Observer"
        case "volunteer":
            return "Volunteer"
        case "admin":
            return "Admin"
    }
}
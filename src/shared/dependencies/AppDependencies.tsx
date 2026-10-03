import AuthRepository from "@/shared/repositories/AuthRepository";
import AppointmentRepository from "@/shared/repositories/AppointmentRepository";
import DogRepository from "@/shared/repositories/DogRepository";
import VolunteerRepository from "@/shared/repositories/VolunteerRepository";
import VolunteerLikesRepository from "@/shared/repositories/VolunteerDogLikeRepository";

export interface AppDependencies {
  authRepository: AuthRepository
  appointmentRepository: AppointmentRepository
  dogRepository: DogRepository
  volunteerRepository: VolunteerRepository
  volunteerLikesRepository: VolunteerLikesRepository
}
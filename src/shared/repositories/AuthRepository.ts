import { AuthUser } from "@/domain/AuthUser"
import { RepositoryOperationStatusEnum } from "@/shared/repositories/enums/RepositoryOperationStatus"

export declare type AuthUnsubscribe = () => void

export declare type AuthListener = (state: RepositoryOperationStatusEnum, result: AuthUser) => void

export default interface AuthRepository {
    signIn(email: string, password: string): Promise<AuthUser>,
    signOut(): Promise<void>,

    subscribeToUser(listener: AuthListener): AuthUnsubscribe
}
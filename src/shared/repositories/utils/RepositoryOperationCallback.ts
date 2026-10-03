import { RepositoryOperationStatusEnum } from "@/shared/repositories/enums/RepositoryOperationStatus";

export type RepositoryOperationCallback = (state: RepositoryOperationStatusEnum, result?: string) => void

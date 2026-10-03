import { useContext } from "react";
import { AppDependencies } from "../AppDependencies";
import { AppDependenciesContext } from "../AppDependenciesProvider";

export function useAppDependencies(): AppDependencies {
    const dependencies = useContext(AppDependenciesContext);

    if (!dependencies) {
        throw new Error(
            "useAppDependencies must be used inside AppDependenciesProvider"
        );
    }

    return dependencies;
}

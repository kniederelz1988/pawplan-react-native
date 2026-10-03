import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import VolunteerDogLikeRepository, { VolunteerDogLikesRepositoryListener,} from "@/shared/repositories/VolunteerDogLikeRepository";

import { Dog } from "@/shared/data/Dog";
import { Volunteer } from "@/shared/data/Volunteer";
import { VolunteerDogLike } from "@/shared/data/VolunteerDogLike";

export default function MockVolunteerDogLikesRepository(): VolunteerDogLikeRepository {
	const likes: VolunteerDogLike[] = [
		{ volunteerId: "volunteer-001", dogId: "dog-002" },
		{ volunteerId: "volunteer-001", dogId: "dog-004" },
		{ volunteerId: "volunteer-001", dogId: "dog-007" },
		{ volunteerId: "volunteer-002", dogId: "dog-001" },
		{ volunteerId: "volunteer-002", dogId: "dog-005" },
		{ volunteerId: "volunteer-002", dogId: "dog-009" },
	];

	const volunteerSubscribers = new Map<string, Set<VolunteerDogLikesRepositoryListener>>();
	const dogSubscribers = new Map<string, Set<VolunteerDogLikesRepositoryListener>>();

	function subscribe(
		subscribers: Map<string, Set<VolunteerDogLikesRepositoryListener>>,
		id: string,
		listener: VolunteerDogLikesRepositoryListener,
		getLikes: () => VolunteerDogLike[],
	): () => void {
		let listeners = subscribers.get(id);
		if (!listeners) {
			listeners = new Set();
			subscribers.set(id, listeners);
		}

		listeners.add(listener);
		listener(getLikes());

		return () => {
			listeners?.delete(listener);
			if (listeners?.size === 0) subscribers.delete(id);
		};
	}

	function notifySubscribers(volunteerId: string, dogId: string): void {
		volunteerSubscribers.get(volunteerId)?.forEach((listener) => {
			listener(likes.filter((like) => like.volunteerId === volunteerId));
		});
		dogSubscribers.get(dogId)?.forEach((listener) => {
			listener(likes.filter((like) => like.dogId === dogId));
		});
	}

	function subscribeForVolunteerLikes(
		volunteerId: string,
		listener: VolunteerDogLikesRepositoryListener,
	): () => void {
		return subscribe(
			volunteerSubscribers,
			volunteerId,
			listener,
			() => likes.filter((like) => like.volunteerId === volunteerId),
		);
	}

	function subscribeForDogLikes(
		dogId: string,
		listener: VolunteerDogLikesRepositoryListener,
	): () => void {
		return subscribe(
			dogSubscribers,
			dogId,
			listener,
			() => likes.filter((like) => like.dogId === dogId),
		);
	}

	async function addLike(
		volunteer: Volunteer,
		dog: Dog,
		operationCallback: RepositoryOperationCallback,
	): Promise<void> {
		if (!volunteer.id || !dog.id) {
			operationCallback("error", "Volunteer and dog IDs are required to add a like.");
			return;
		}

		const alreadyLiked = likes.some(
			(like) => like.volunteerId === volunteer.id && like.dogId === dog.id,
		);
		if (!alreadyLiked) {
			likes.push({ volunteerId: volunteer.id, dogId: dog.id });
			notifySubscribers(volunteer.id, dog.id);
		}

		operationCallback("success");
	}

	async function removeLike(
		volunteer: Volunteer,
		dog: Dog,
		operationCallback: RepositoryOperationCallback,
	): Promise<void> {
		if (!volunteer.id || !dog.id) {
			operationCallback("error", "Volunteer and dog IDs are required to remove a like.");
			return;
		}

		const index = likes.findIndex(
			(like) => like.volunteerId === volunteer.id && like.dogId === dog.id,
		);
		if (index >= 0) {
			likes.splice(index, 1);
			notifySubscribers(volunteer.id, dog.id);
		}

		operationCallback("success");
	}

	return {
		subscribeForVolunteerLikes,
		subscribeForDogLikes,
		addLike,
		removeLike,
	};
}
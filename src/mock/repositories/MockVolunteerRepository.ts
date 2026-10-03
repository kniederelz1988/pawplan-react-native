import VolunteerRepository from "@/shared/repositories/VolunteerRepository";
import { Volunteer } from "@/shared/data/Volunteer";
import { VolunteerRole } from "@/shared/data/VolunteerRole";
import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";

export default function MockVolunteerRepository(): VolunteerRepository {
	const volunteers: Volunteer[] = [
		{
			id: "volunteer-001",
			userId: "user-001",
			name: "Alex Morgan",
			birthday: new Date("1992-04-15"),
			volunteerSince: new Date("2022-09-01"),
		},
		{
			id: "volunteer-002",
			userId: "user-002",
			name: "Jordan Lee",
			birthday: new Date("1988-11-23"),
			volunteerSince: new Date("2023-03-12"),
		},
	];
	const roles = new Map<string, VolunteerRole>([
		["volunteer-001", { role: "volunteer" }],
		["volunteer-002", { role: "observer" }],
	]);
	let nextVolunteerId = volunteers.length + 1;

	function subscribeForAllVolunteers(
		queryCursor: Volunteer | null,
		queryLimit: number,
		listener: (result: Volunteer[]) => void,
	): () => void {
		const sorted = [...volunteers].sort((a, b) => b.name.localeCompare(a.name));
		const cursorIndex = queryCursor
			? sorted.findIndex((volunteer) => volunteer.id === queryCursor.id)
			: -1;
		const afterCursor = cursorIndex >= 0
			? sorted.slice(cursorIndex + 1)
			: queryCursor
				? sorted.filter((volunteer) => volunteer.name.localeCompare(queryCursor.name) < 0)
				: sorted;

		listener(afterCursor.slice(0, Math.max(0, queryLimit)));
		return () => {};
	}

	function subscribeForVolunteerByUserId(
		userId: string,
		listener: (result: Volunteer[]) => void,
	): () => void {
		listener(volunteers.filter((volunteer) => volunteer.userId === userId));
		return () => {};
	}

	function subscribeForVolunteer(
		volunteerId: string,
		listener: (result: Volunteer[]) => void,
	): () => void {
		listener(volunteers.filter((volunteer) => volunteer.id === volunteerId));
		return () => {};
	}

	function subscribeForVolunteerRole(
		volunteerId: string,
		listener: (result: VolunteerRole) => void,
	): () => void {
		const role = roles.get(volunteerId);
		if (role) listener(role);
		return () => {};
	}

	async function createVolunteer(
		volunteer: Volunteer,
		operationCallback: RepositoryOperationCallback,
	): Promise<void> {
		if (volunteer.id) {
			operationCallback("error", "A new volunteer must not already have an ID.");
			return;
		}

		const id = `volunteer-${String(nextVolunteerId++).padStart(3, "0")}`;
		volunteers.push({ ...volunteer, id });
		roles.set(id, { role: "observer" });
		operationCallback("success");
	}

	async function updateVolunteer(
		volunteer: Volunteer,
		operationCallback: RepositoryOperationCallback,
	): Promise<void> {
		const index = volunteers.findIndex((item) => item.id === volunteer.id);
		if (!volunteer.id || index < 0) {
			operationCallback("error", "Volunteer not found.");
			return;
		}

		volunteers[index] = volunteer;
		operationCallback("success");
	}

	async function updateVolunteerRole(
		volunteer: Volunteer,
		role: VolunteerRole,
		operationCallback: RepositoryOperationCallback,
	): Promise<void> {
		if (!volunteer.id || !roles.has(volunteer.id)) {
			operationCallback("error", "Volunteer role not found.");
			return;
		}

		roles.set(volunteer.id, role);
		operationCallback("success");
	}

	async function deleteVolunteer(
		volunteer: Volunteer,
		operationCallback: RepositoryOperationCallback,
	): Promise<void> {
		const index = volunteers.findIndex((item) => item.id === volunteer.id);
		if (!volunteer.id || index < 0) {
			operationCallback("error", "Volunteer not found.");
			return;
		}

		volunteers.splice(index, 1);
		roles.delete(volunteer.id);
		operationCallback("success");
	}

	function createVolunteerIfNonExistant(
		userID: string,
		name: string,
		operationCallback: RepositoryOperationCallback,
	): void {
		const existingVolunteer = volunteers.find((volunteer) => volunteer.userId === userID);
		if (existingVolunteer) {
			void updateVolunteer({ ...existingVolunteer, name }, operationCallback);
			return;
		}

		void createVolunteer(
			{
				userId: userID,
				name,
				birthday: new Date(),
				volunteerSince: new Date(),
			},
			operationCallback,
		);
	}

	return {
		subscribeForAllVolunteers,
		subscribeForVolunteerByUserId,
		subscribeForVolunteer,
		subscribeForVolunteerRole,
		createVolunteer,
		updateVolunteer,
		updateVolunteerRole,
		deleteVolunteer,
		createVolunteerIfNonExistant,
	};
}
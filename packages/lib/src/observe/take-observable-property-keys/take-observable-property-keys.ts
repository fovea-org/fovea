import {canBeObserved} from "../can-be-observed/can-be-observed";

/**
 * Loops through the given value and returns all the keys on which the corresponding values can be observed
 * @param {T[] | T} value
 * @returns {PropertyKey[]}
 */
export function takeObservablePropertyKeys<T extends object> (value: T|T[]): PropertyKey[] {
	// Instantiate an empty array of PropertyKeys
	const keys: PropertyKey[] = [];

	if (Array.isArray(value)) {
		// Loop through its' members and add their indexes if they can be observed
		value.forEach((part, index) => {
			if (canBeObserved(part)) keys.push(index);
		});
	}

	else {
		// Loop through its' properties and add their keys if they can be observed
		Object.entries(value).forEach(entry => {
			const [key, nestedValue] = entry;
			if (canBeObserved(nestedValue)) keys.push(key);
		});
	}
	return keys;
}
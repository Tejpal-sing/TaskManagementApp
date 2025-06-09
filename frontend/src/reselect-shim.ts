import { createSelector } from "reselect";

export function createSelectorCreator(...args: any[]) {
	return (...selectorArgs: any[]) => createSelector(...selectorArgs);
}

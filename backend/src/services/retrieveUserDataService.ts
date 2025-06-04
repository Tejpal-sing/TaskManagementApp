import { retrieveUserDataRepository } from "../repository/retrieveUserDataRepository";

export const retrieveUserDataService = async (userId: number) => {
  return await retrieveUserDataRepository(userId);
};

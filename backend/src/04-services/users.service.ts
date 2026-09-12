import * as usersRepo from "../05-repository/users.repository.js";

export const updatePreferredCurrency = async (userId: number, currency: string) => {
  return await usersRepo.updatePreferredCurrency(userId, currency);
};

export const getUserSettings = async (userId: number) => {
  return await usersRepo.getUserSettings(userId);
};

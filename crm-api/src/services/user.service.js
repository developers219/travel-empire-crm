import * as userRepository from "../repositories/user.repository.js";

export const getActiveExecutives = async () => {
  return userRepository.findActiveExecutives();
};

import db from "../db/db.js";
import { clientModel } from "../model/clientModel.js";
import { userService } from "./user.service.js";
import type { NewClient, NewUserInput } from "../types/index.js";

export const createClientWithOwner = (
  clientData: NewClient,
  userData: NewUserInput
) => {
  return db.transaction(async (trx) => {
    const newClient = await clientModel.create(clientData, trx);
    const newUser = await userService.create({
      newUserData: { ...userData, client_id: newClient.id },
      currentUser: null,
      trx,
    });
    return { client: newClient, owner: newUser };
  });
};

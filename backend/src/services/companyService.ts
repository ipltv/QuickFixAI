import db from "../db/db.js";
import { clientModel } from "../model/clientModel.js";
import { userModel } from "../model/userModel.js";
import { type NewClient, type NewUser } from "../types/index.js";

export const createClientWithOwner = (
  clientData: NewClient,
  userData: NewUser
) => {
  return db.transaction(async (trx) => {
    const newClient = await clientModel.create(clientData, trx);
    const newUser = await userModel.create(
      { ...userData, client_id: newClient.id },
      trx
    );
  });
};

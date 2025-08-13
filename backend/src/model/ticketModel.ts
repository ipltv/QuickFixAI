// models/ticketModel.ts
import db from "../db/db.js";
import type {
  TicketDB,
  NewTicketData,
  TicketWithDetails,
} from "../types/types.js";

const TABLE_NAME = "tickets";

export const ticketModel = {
  /**
   * Creates a new ticket and its first message in a single transaction.
   * @param ticketData - The data for the new ticket.
   * @returns The created ticket.
   */
  async create(ticketData: NewTicketData): Promise<TicketDB> {
    const { description, ...ticketFields } = ticketData;

    return db.transaction(async (trx) => {
      const [ticket] = await trx<TicketDB>(TABLE_NAME)
        .insert(ticketFields)
        .returning([
          "id",
          "created_by",
          "category",
          "status",
          "priority",
          "subject",
          "description",
          "equipment_id",
          "created_at",
          "updated_at",
        ]);
      if (!ticket) {
        throw new Error("Failed to create ticket");
      }
      if (description) {
        await trx("ticket_messages").insert({
          ticket_id: ticket.id,
          author_id: ticket.created_by,
          author_type: "user",
          content: description,
        });
      }

      return ticket as TicketDB;
    });
  },

  /**
   * Finds a ticket by ID and joins it with user and equipment details.
   * @param id - The ticket's UUID.
   * @returns The found ticket with extra details.
   */
  async findById(id: string): Promise<TicketWithDetails | undefined> {
    return db<TicketDB>(TABLE_NAME)
      .where(`${TABLE_NAME}.id`, id)
      .leftJoin("users", "tickets.created_by", "users.id")
      .leftJoin("equipment", "tickets.equipment_id", "equipment.id")
      .select(
        "tickets.*",
        "users.name as creator_name",
        "users.email as creator_email",
        "equipment.name as equipment_name"
      )
      .first();
  },
};

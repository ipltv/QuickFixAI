/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('ticket_messages', (table) => {
    // Add the new column, making it a foreign key to the ai_responses table.
    // ON DELETE SET NULL means if the original AI response is deleted, this link becomes null
    // without deleting the message itself.
    table.uuid('ai_response_id')
         .references('id')
         .inTable('ai_responses')
         .onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('ticket_messages', (table) => {
    table.dropForeign('ai_response_id');
    table.dropColumn('ai_response_id');
  });
};

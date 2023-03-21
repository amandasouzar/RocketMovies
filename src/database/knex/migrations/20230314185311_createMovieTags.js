exports.up = knex => knex.schema.createTable('moviesTags', table => {
    table.increments('id')
    table.text('title')

    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('note_id').references('id').inTable('moviesNotes').onDelete('CASCADE')

    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('moviesTags')


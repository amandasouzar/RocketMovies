const knex = require("../database/knex");

class MoviesTags {
    async show(req, res) {
        const {note_id} = req.params

        const tags = await knex('moviesTags').where({note_id})

        return res.status(200).json(tags)
    }
}

module.exports = MoviesTags
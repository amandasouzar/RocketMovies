const knex = require("../database/knex");

class MoviesNotes {
  async create(req, res) {
    const { title, description, stars, tags } = req.body;
    const { user_id } = req.params;

    const note_id = await knex("moviesNotes").insert({
      title,
      description,
      stars,
      user_id,
    });

    const tagsToAdd = tags.map((tag) => {
      return {
        note_id: note_id[0],
        title: tag,
        user_id,
      };
    });

    await knex("moviesTags").insert(tagsToAdd);

    return res
      .status(200)
      .json({ message: "You just added a new movie note!" });
  }

  async delete(req, res) {
    const { note_id } = req.params;

    const noteForDelete = await knex("moviesNotes")
      .delete()
      .where({ id: note_id });

    if (noteForDelete) {
      return res.status(200).json({ message: "Note deleted!" });
    } else {
      return res.status(400).json({ message: "Note was not found." });
    }
  }

  async show(req, res) {
    const { note_id } = req.params;

    const notes = await knex("moviesNotes").where({ id: note_id });
    const tags = await knex("moviesTags").where({ note_id }).orderBy("title");

    if (notes && tags) {
      return res.status(200).json({ notes, tags });
    } else {
      return res.status(400).json({ message: "Note not found!" });
    }
  }

  async filter(req, res) {
    const { user_id, title, tags } = req.query;

    if (!tags && !title) {
      const filteredNotesByUser = await knex("moviesNotes").where({ user_id });

      return res.status(200).json(filteredNotesByUser);
    }

    if (!tags) {
      const filteredNotesByUserAndTitle = await knex("moviesNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`);

      return res.status(200).json(filteredNotesByUserAndTitle);
    }  
    
    if (tags && title) {
      const tagsArray = tags.split(",").map((tag) => {
        return tag;
      });

      const filtedNotesByAll = await knex("moviesTags")
        .select([
          "moviesNotes.id",
          "moviesNotes.title",
          "moviesNotes.description",
          "moviesNotes.stars",
          "moviesNotes.user_id",
          "moviesNotes.created_at",
          "moviesNotes.updated_at"
        ])
        .where('moviesNotes.user_id', user_id)
        .whereLike("moviesNotes.title", `%${title}%`)
        .whereIn('moviesTags.title', tagsArray)
        .innerJoin('moviesNotes', 'moviesNotes.id', 'moviesTags.note_id')

        return res.status(200).json(filtedNotesByAll);
    }
  }
}

module.exports = MoviesNotes;

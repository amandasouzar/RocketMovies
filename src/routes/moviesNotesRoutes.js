const Router = require('express')
const MoviesNotesController = require('../controllers/movieNotes')

const moviesNotesRouter = Router()
const moviesNotesController = new MoviesNotesController()

moviesNotesRouter.post('/:user_id', moviesNotesController.create)
moviesNotesRouter.get('/:note_id', moviesNotesController.show)
moviesNotesRouter.get('/', moviesNotesController.filter)
moviesNotesRouter.delete('/:note_id', moviesNotesController.delete)

module.exports = moviesNotesRouter
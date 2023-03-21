const Router = require('express')
const routes = Router()

const userRoutes = require('../routes/userRoutes')
const moviesNotesRouter = require('../routes/moviesNotesRoutes')

routes.use('/users', userRoutes)
routes.use('/movies_notes', moviesNotesRouter)

module.exports = routes
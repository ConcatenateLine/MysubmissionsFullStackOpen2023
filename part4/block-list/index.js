const app = require('./app')
const { SERVER_PORT } = require('./utils/config')
const logger = require('./utils/logger')

const PORT = SERVER_PORT || 3001

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
'use strict'

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 3001
  },
  rethinkdb: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 28015,
    authKey: '',
    db: process.env.DB_NAME || 'ormigga'
  },
  secret: process.env.FLIGO_SECRET || 'fl!g02017@' // never use default
}

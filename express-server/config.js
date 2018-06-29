'use strict'

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 3001
  },
  rethinkdb: {
    host: process.env.DB_HOST || '45.55.55.181',
    port: process.env.DB_PORT || 28015,
    authKey: '',
    db: process.env.DB_NAME || 'ormigga'
  },
  secret: process.env.FLIGO_SECRET || 'fl!g02017@' // never use default
}

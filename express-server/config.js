module.exports = {
    rethinkdb: {
        host: "localhost",
        port: 28015,
        authKey: "",
        db: "ormigga"
    },
    secret: process.env.FLIGO_SECRET || 'fl!g02017@' // never use default
}
var rethinkdb = require('rethinkdb');
var co = require('co');

module.exports.insertData = function (req, table, data, callback) {
    let tasks = co.wrap(function* () {
        let created;
        data.createdAt = new Date().toISOString();

        let result = yield rethinkdb.table(table).insert(data).run(req._rdbConn);

        if (result.errors > 0) {
            return Promise.reject(new Error(result.first_error))
        }

        created = { status: true, id: result.generated_keys[0] }

        return Promise.resolve(created)
    })

    return Promise.resolve(tasks());
}
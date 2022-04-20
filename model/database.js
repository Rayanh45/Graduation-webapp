var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
if(err){
    console.error(err.message);
} else {
    console.log('Connected to the database.');
    db.run(`
    CREATE TABLE if not exists words(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word text,
        createdAt text)`);
}
});


module.exports = db

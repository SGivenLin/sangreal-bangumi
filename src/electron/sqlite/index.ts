import sqlite3 from 'sqlite3'
const path = require('path')
const fs = require('fs')
const dbFile = path.resolve('./bangumi.db')
const exists = fs.existsSync(dbFile);

const db = new (sqlite3.verbose()).Database(dbFile, err => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the test database.')
})


db.serialize(function() {
    if (!exists) {
        createTable()
    }
    // var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");

    // //Insert random data
    // var rnd;
    // for (var i = 0; i < 10; i++) {
    //     rnd = Math.floor(Math.random() * 10000000);
    //     stmt.run("Thing #" + rnd);
    // }

    // stmt.finalize();
    // db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
    //     console.log(row.id + ": " + row.thing);
    // });
});

function createTable(): void {
    db.run("CREATE TABLE bangumi_2_author (id integer primary key AUTOINCREMENT, bangumi_id integer, author_id integer, author_name text), relation text");
    console.log('createTable')
}


export default db

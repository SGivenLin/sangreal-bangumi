import sqlite3 from 'sqlite3'
const path = require('path')
const fs = require('fs')
const dbFile = path.resolve('./bangumi.db')
const exists = fs.existsSync(dbFile);

const db = new (sqlite3.verbose()).Database(dbFile, err => {
  if (err) {
    console.error(err.message)
  }
})


db.serialize(function() {
    if (!exists) {
        createTable()
    }
})

function createTable(): void {
    db.run("CREATE TABLE bangumi_2_author (id integer primary key AUTOINCREMENT, bangumi_id integer, author_id integer, author_name text, author_images text, relation text)");
    db.run("CREATE TABLE bangumi (bangumi_id integer primary key, name text, bangumi_legal_type integer)");
}


export default db

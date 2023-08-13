import { app, dialog } from 'electron'
import { isDev } from '../env'
import sqlite3 from 'sqlite3'

const path = require('path')
const fs = require('fs')
const dbFile = path.resolve(isDev ? '' : app.getPath('userData'), './bangumi.db')
const exists = fs.existsSync(dbFile);

const db = new (sqlite3.verbose()).Database(dbFile, err => {
  if (err) {
    console.error(err.message)
  }
})

async function initDB() {
    return new Promise<void>((resolve, reject) => {
      db.serialize(function() {
        if (!exists) {
          const sql =  `CREATE TABLE bangumi_2_author (id integer primary key AUTOINCREMENT, bangumi_id integer, author_id integer, author_name text, author_images text, relation text);
          CREATE TABLE bangumi (bangumi_id integer primary key, name text, bangumi_legal_type integer);`
          db.exec(sql, (err) => {
            if (err) {
              dialog.showErrorBox('数据库文件初始化错误', String(err))
              app.exit()
              reject(err)
            } else {
              resolve()
            }
            
          })
        }
      })
    })
}


export default db
export { initDB }

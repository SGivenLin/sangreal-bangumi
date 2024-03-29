import db from './index'
import { executePromisesWithLimit } from 'src/lib/utils'

interface BangumiAuthor {
    id?: number,
    bangumi_id: number
    author_id: number
    relation: string
    author_name: string,
    author_images: string, // json
}

enum Bangumi_legal_type{
    common,
    r18,
}
interface Bangumi {
    id?: number,
    bangumi_id: number,
    name: string,
    bangumi_legal_type: Bangumi_legal_type
}

function getBangumiAuthor(data: Array<number>): Promise<Array<BangumiAuthor>> {
    if (data.length === 0) {
        console.warn('getBangumiAuthor no data')
        return Promise.resolve([])
    }
    const str = data.join(',')
    const sql = `select * from bangumi_2_author where bangumi_id in (${str})`
    return new Promise((resolve, reject) => {
        db.all<BangumiAuthor>(sql, (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows)
        })
    })
    
}

function setBangumiAuthor(data: Array<BangumiAuthor>) {
    if (data.length === 0) {
        console.warn('setBangumiAuthor no data')
        return Promise.resolve()
    }
    const arr = groupArray(data, 80)
    const taskList = arr.map(data => {
        let str = ''
        let content: (string | number)[] = []
        data.forEach(item => {
            str += '(?,?,?,?,?),'
            content.push(item.bangumi_id)
            content.push(item.author_id)
            content.push(item.author_name)
            content.push(item.author_images)
            content.push(item.relation)
        })
        const sql = `insert into bangumi_2_author (bangumi_id, author_id, author_name, author_images, relation) values ${str.slice(0, str.length - 1)}`
        return {
            key: 0,
            promise: new Promise<void>((resolve, reject) => {
                db.run(sql, content, err => {
                    if (err) {
                        return reject(err)
                    }
                    resolve()
                })
            }),
        }
    })
    return executePromisesWithLimit<void>(taskList, 10)
}

function setBangumi(data: Bangumi[]) {
    if (data.length === 0) {
        console.warn('setBangumi no data')
        return Promise.resolve([])
    }
    const sql = 'INSERT INTO bangumi (bangumi_id, name, bangumi_legal_type) VALUES (?, ?, ?)'
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            const stmt = db.prepare(sql)
            data.forEach(item => {
                stmt.run(item.bangumi_id, item.name, item.bangumi_legal_type)
            })
            stmt.finalize((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    })
}

function getIllegalBangumi(): Promise<Bangumi[]> {
    const sql = `select * from bangumi where bangumi_legal_type=1`
    return new Promise((resolve, reject) => {
        db.all<Bangumi>(sql, (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows)
        })
    })
}

function getAllRelation(): Promise<string[]>{
    const sql = `select DISTINCT relation from bangumi_2_author`
    return new Promise((resolve, reject) => {
        db.all<{ relation: string }>(sql, (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows.map(item => item.relation))
        })
    })
}
 
function groupArray<T>(arr: Array<T>, n: number) {
    const len = arr.length
    const result = []
    let i = 0
    while (i < len) {
        result.push(arr.slice(i, i + n))
        i += n
    }
    return result
}
  

export {
    setBangumiAuthor,
    getBangumiAuthor,
    setBangumi,
    getIllegalBangumi,
    getAllRelation,
    type BangumiAuthor,
}
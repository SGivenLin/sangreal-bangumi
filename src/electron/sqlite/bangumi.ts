import db from './index'

interface BangumiAuthor {
    id?: number,
    bangumi_id: number
    author_id: number
    relation: string
    author_name: string
}

function getBangumiAuthor(data: Array<number>): Promise<Array<BangumiAuthor>> {
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
    let str = ''
    data.forEach(item => {
        str += `(${item.bangumi_id},${item.author_id},"${item.author_name}","${item.relation}"),`
    })
    const sql = `insert into bangumi_2_author (bangumi_id, author_id, author_name, relation) values ${str.slice(0, str.length - 1)}`
    return new Promise((resolve, reject) => {
        db.all<BangumiAuthor>(sql, (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows)
        })
    })
}

export {
    setBangumiAuthor,
    getBangumiAuthor,
    type BangumiAuthor,
}
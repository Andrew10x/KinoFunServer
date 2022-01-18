const db = require('./DB');

class Comments {
    #pool = db.getPool();

    async getSelComments(id) {
        const r = await this.#pool.query(`select * from Comments where filmid=${id}`);  
        const data = Object.values(r.rows);
        return data;
    }

    async addCommnent(comObj) {
        if(comObj.hasOwnProperty('nickname') && comObj.hasOwnProperty('filmid') && comObj.hasOwnProperty('commentary'))
        await this.#pool.query(`insert into Comments(Nickname, FilmId, Commentary)
            values('${comObj.nickname}', ${comObj.filmid}, '${comObj.commentary}')`)
    }

    async getCommentsByDate(dateObj) {
        if(dateObj.hasOwnProperty('date')) {
            const r = await this.#pool.query(`select * from Comments where commentdate='${dateObj.date}'`);  
            const data = Object.values(r.rows);
            return data;
        }
        return [];
    }

    async delComment(id) {
        console.log(id)
        await this.#pool.query(`delete from Comments where commentid=${id}`);
    }
}

module.exports = new Comments();
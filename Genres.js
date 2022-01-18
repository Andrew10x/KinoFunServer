const db = require('./DB');

class Genres {
    #pool = db.getPool();

    async getGenres() {
        const r = await this.#pool.query(`select * from Genres`);  
        const data = Object.values(r.rows);
        return data;
    }

    async addGenre(genreObj) {
        console.log(genreObj)
        if(genreObj.hasOwnProperty('genrename'))
            await this.#pool.query(`insert into Genres(genrename) values('${genreObj.genrename}')`);  
    }

    async getGenre(id) {
        const r = await this.#pool.query(`select * from Genres where genreid=${id}`);  
        const data = Object.values(r.rows);
        return data;
    }

    async delGenre(id) {
        await this.#pool.query(`delete from Genres where genreid=${id}`);  
    }

    async editGenre(id, genreObj) {
        await this.#pool.query(`update Genres set genrename='${genreObj.genrename}' where genreid = ${id}`)
    }
}

module.exports = new Genres();
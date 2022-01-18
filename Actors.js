const db = require('./DB');

class Actors {
    #pool = db.getPool();

    async addActor(actObj) {
        if(actObj.hasOwnProperty('actorname') && actObj.hasOwnProperty('photourl') && actObj.hasOwnProperty('actordescription'))
        await this.#pool.query(`insert into Actors(actorname, photourl, actordescription)
        values('${actObj.actorname}', '${actObj.photourl}', '${actObj.actordescription}')`)
        
    }

    async getActors() {
        const r = await this.#pool.query(`select * from Actors order by actorname`);  
        const data = Object.values(r.rows);
        return data;
    }

    async delActor(id) {
        await this.#pool.query(`delete from Actors where actorid = ${id}`);  
    }

    async editActor(id, actObj) {
        console.log(id, actObj)
        if(actObj.hasOwnProperty('actorname') && actObj.hasOwnProperty('photourl') && actObj.hasOwnProperty('actordescription')){
            await this.#pool.query(`update Actors set actorname='${actObj.actorname}',
             photourl='${actObj.photourl}', actordescription = '${actObj.actordescription}'
             where actorid = ${id}`)
        }
    
    }

}

module.exports = new Actors();
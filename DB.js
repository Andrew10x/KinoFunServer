pg = require('pg')
let express = require('express');;

let app = express();


class DB {
    #config = {
        user: 'postgres',
        host: 'localhost',
        database: 'KinoFun',
        password: '1234',
        port: 5432,
    };
    /*
    #config = {
        user: 'dkuwjztw',
        host: 'abul.db.elephantsql.com',
        database: 'dkuwjztw',
        password: 'bWf2kBKV3idwTwICRjx3nh-KAAmy-FTZ',
        port: 5432,
    }*/

    pool

    constructor() {
        if(typeof DB.instance === 'object') {
            return DB.instance;
        }
        DB.instance = this;
        this.pool = new pg.Pool(this.#config);
        return this;
    }

    getPool() {
        return this.pool;
    }

    async getHitFilms() {
        const r = await this.pool.query('select * from Films where isHit=1');  
        const data = Object.values(r.rows);
        return data;
    }

    async getFilm(id) {
        if(id) {
            const r = await this.pool.query(`select * from Films f 
            join FilmGenre fg on f.filmid = fg.filmid join Genres g on fg.genreid = g.genreid
            join FilmActor fa on fa.filmid = f.filmid join Actors ac on fa.actorid = ac.actorid
            join Countries co on f.countryid = co.countryid where f.filmid = ${id}`);  
            const data = Object.values(r.rows);
            return [this.joinFilmInform(data)];
        }
        else return [];
    }

    async getActor(id) {
        const r = await this.pool.query(`select * from Actors ac left join FilmActor fa on 
        ac.actorid = fa.actorid left join Films f on fa.filmid = f.filmid
        where ac.actorid=${id}`);  
        const data = Object.values(r.rows);
        return this.joinActorInform(data);
    }

    async getFilmFilter(nameObj) {
        let r;
        if(nameObj.hasOwnProperty('name'))
            r = await this.pool.query(`select * from Films where filmname like '%${nameObj.name}%'`);  
        else if(nameObj.hasOwnProperty('genre'))
            r = await this.pool.query(`select * from Films f join FilmGenre fg on 
            f.filmid = fg.filmid join Genres g on fg.genreid = g.genreid where g.genrename='${nameObj.genre}'`);
        else return [];
            const data = Object.values(r.rows);
        return data;
    }

    async getActorByName(nameObj) {
        const r = await this.pool.query(`select * from Actors where actorname like '%${nameObj.name}%'`);  
        const data = Object.values(r.rows);
        return data;
    }
    
    joinFilmInform(filmArr) {
        const filmObj ={
            filmid: filmArr[0].filmid,
            year: filmArr[0].year,
            duration: filmArr[0].duration,
            description: filmArr[0].description,
            videourl: filmArr[0].videourl,
            posterurl: filmArr[0].posterurl,
            filmname: filmArr[0].filmname,
            genrename: [filmArr[0].genrename],
            actorid: [filmArr[0].actorid],
            ishit: filmArr[0].ishit,
            actor: [[filmArr[0].actorid, filmArr[0].actorname]],
            countryname: filmArr[0].countryname,
        }
        for(let i=0; i<filmArr.length; i++) {
            if(!(filmObj.genrename).includes(filmArr[i].genrename)) 
                filmObj.genrename.push(filmArr[i].genrename);

            if(!(filmObj.actorid).includes(filmArr[i].actorid)) {
                filmObj.actorid.push(filmArr[i].actorid);
                filmObj.actor.push([filmArr[i].actorid, filmArr[i].actorname]);
            }
        }

        return filmObj;
    }

    joinActorInform(fActArr) {
        const ActorObj = {
            actorid: fActArr[0].actorid,
            actorname: fActArr[0].actorname,
            actordescription: fActArr[0].actordescription,
            photourl: fActArr[0].photourl,
            filmid: [fActArr[0].filmid],
            film: [[fActArr[0].filmid, fActArr[0].filmname]]
        }

        for(let i=0; i<fActArr.length; i++) {
            if(!(ActorObj.filmid).includes(fActArr[i].filmid)){
                ActorObj.filmid.push(fActArr[i].filmid);
                ActorObj.film.push([fActArr[i].filmid, fActArr[i].filmname])
            }
        }
        return ActorObj;
}
}

module.exports = new DB();
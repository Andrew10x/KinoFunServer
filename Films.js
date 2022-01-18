const db = require('./DB');

class Films {
    #pool = db.getPool();

    async getFilmByName(nameObj) {
        if(nameObj.hasOwnProperty('name')) {
            const r = await this.#pool.query(`select * from Films where filmname like '%${nameObj.name}%'`);  
            const data = Object.values(r.rows);
            return data;
        }
        return []; 
    }

    async getFilmsByGenres(genresArr) {

        if(genresArr.length) {
            let inStr = ` in (${genresArr[0]}`;

            for(let i=1; i<genresArr.length; i++) {
                inStr += `, ${genresArr[i]}`;
            }
            inStr += ')';
            const r = await this.#pool.query(`select * from Films f 
                join FilmGenre fg on f.filmid = fg.filmid join Genres g on fg.genreid = g.genreid
                where g.genreid ` + inStr);  
            const data = Object.values(r.rows);
            return this.getDistinctFilms(data);
        }
        return [];
    }

    async addFilm(filmObj){
        /*const id = await this.#pool.query(`insert into countries(countryname)
        values('Португалія') returning countryid`)
        console.log(Object.values(id.rows)[0].countryid);
*/
        filmObj.description = filmObj.description.replaceAll("'", "''");
        let countryId = await this.#pool.query(`select countryid from countries where countryname='${filmObj.countryname}' limit 1`)
        countryId = Object.values(countryId.rows)[0].countryid;
        
        let filmId = await this.#pool.query(`insert into films(year, duration, description, videourl, 
            posterurl, countryid, ishit, filmname)
            values(${filmObj.year}, '${filmObj.duration}', '${filmObj.description}', 
            '${filmObj.videourl}', '${filmObj.posterurl}', ${countryId}, ${Number(filmObj.ishit)},
            '${filmObj.filmname}') returning filmid`);
        
        filmId = Object.values(filmId.rows)[0].filmid;

        await this.#pool.query(`delete from filmgenre where filmid = ${filmId}`);
        await this.#pool.query(`delete from filmactor where filmid = ${filmId}`);

        for(let i=0; i<filmObj.genresid.length; i++) {
            await this.#pool.query (`insert into filmgenre(filmid, genreid) values(${filmId}, ${Number(filmObj.genresid[i])})`);
        }

        for(let i=0; i<filmObj.actorsid.length; i++) {
            await this.#pool.query (`insert into FilmActor(filmid, actorid) values(${filmId}, ${Number(filmObj.actorsid[i])})`);
        }
           

    }

    getDistinctFilms(data) {
        const idArr=[];
        const newData = [];
        for(let i=0; i<data.length; i++) {
            if(!idArr.includes(data[i].filmid)) {
                newData.push(data[i]);
                idArr.push(data[i].filmid);
            }
        }
       return newData;
    }

    async getFilms() {
        const r = await this.#pool.query(`select * from Films`);  
        const data = Object.values(r.rows);
        return data;
    }

    async delFilm(id) {
        await this.#pool.query(`delete from FilmActor where filmid=${Number(id)}`);
        await this.#pool.query(`delete from FilmGenre where filmid=${Number(id)}`);
        await this.#pool.query(`delete from Films where filmid=${Number(id)}`); 
    }

    async editFilm(filmObj) {
        filmObj.description = filmObj.description.replaceAll("'", "''");
        filmObj.ishit = Number(filmObj.ishit);
        let countryId = await this.#pool.query(`select countryid from countries where countryname='${filmObj.countryname}' limit 1`)
        countryId = Object.values(countryId.rows)[0].countryid;

        console.log(`update films
        set year=${filmObj.year}, duration='${filmObj.duration}', description='${filmObj.description}', 
        videourl='${filmObj.videourl}', posterurl='${filmObj.posterurl}', 
        countryid=${countryId}, ishit=${filmObj.ishit}, filmname='${filmObj.filmname}' 
        where filmid=${filmObj.filmid}`)


        
        await this.#pool.query(`update films
            set year=${filmObj.year}, duration='${filmObj.duration}', description='${filmObj.description}', 
            videourl='${filmObj.videourl}', posterurl='${filmObj.posterurl}', 
            countryid=${countryId}, ishit=${filmObj.ishit}, filmname='${filmObj.filmname}'
            where filmid=${filmObj.filmid}`);

        if(filmObj.genresid.length){
            await this.#pool.query(`delete from filmgenre where filmid = ${filmObj.filmid}`);
            for(let i=0; i<filmObj.genresid.length; i++) {
                await this.#pool.query (`insert into filmgenre(filmid, genreid) values(${filmObj.filmid}, ${Number(filmObj.genresid[i])})`);
            }

        }
        await this.#pool.query(`delete from filmactor where filmid = ${filmObj.filmid}`);


        for(let i=0; i<filmObj.actorsid.length; i++) {
            await this.#pool.query (`insert into FilmActor(filmid, actorid) values(${filmObj.filmid}, ${Number(filmObj.actorsid[i])})`);
        }

    }

}

module.exports = new Films();
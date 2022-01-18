const db = require('./DB');

class Countries {
    #pool = db.getPool();

    async getCountries() {
        const r = await this.#pool.query(`select * from Countries`);  
        const data = Object.values(r.rows);
        return data;
    }

    async getCountry(id) {
        const r = await this.#pool.query(`select * from Countries where countryid=${id}`);  
        const data = Object.values(r.rows);
        return data;
    }

    async delCountry(id) {
        await this.#pool.query(`delete from Countries where countryid=${id}`);  
    }

    async editCountry(id, CountryObj) {
        await this.#pool.query(`update Countries set countryname='${CountryObj.countryname}' where countryid=${id}`);  
    }
    

    async addCountry(counObj) {
        if(counObj.hasOwnProperty('countryname'))
        await this.#pool.query(`insert into Countries(countryname)
            values('${counObj.countryname}')`)
    }
}

module.exports = new Countries();
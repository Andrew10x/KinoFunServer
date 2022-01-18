const db = require('./DB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('./config')

class Users {
    #pool = db.getPool();
    

    generateAccessToken = (id, rolename) => {
        const payload = {
            id,
            rolename
        }
        return jwt.sign(payload, secret, {expiresIn: "365d"} )
    }

    async addUser(userObj) {

        const r = await this.#pool.query(`select count(*) from Users where login = '${userObj.login}'`);  
        const isUser = Object.values(r.rows)[0].count;
        if(isUser !== '0') {
            return -1;
        }      

        userObj.password = bcrypt.hashSync(userObj.password, 7);
        await this.#pool.query(`insert into users(firstname, lastname, middlename, login, password,
            roleid) values('${userObj.firstname}', '${userObj.lastname}', '${userObj.middlename}',
            '${userObj.login}', '${userObj.password}', ${userObj.roleid}) `);
        
        return 0;
    }

    async loginUser(req, res) {
        try {
            const {login, password} = req.body
            const r = await this.#pool.query(`select * from Users u join Roles r on
             u.roleid = r.roleid where u.login = '${login}'`);  
            const user = Object.values(r.rows)[0];
            if(!user) {
                res.status(400).json({message: 'Пользователь не найден'})
                return;
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                res.status(400).json({message: 'Введен неверный пароль'})
                return;
            }


            const token = this.generateAccessToken(user.userid, user.rolename);
            return res.json({token})
        }
        catch(e) {
            console.log(e)
            res.status(400).json({message: 'Login Error'})
        } 
    }

    async getUsers() {
        const r = await this.#pool.query(`select * from Users`);  
        const data = Object.values(r.rows);
        return data;
    }

    async getUser(id) {
        const r = await this.#pool.query(`select * from Users where userid=${id}`);  
        const data = Object.values(r.rows);
        return data;
    }

    async delUser(id) {
        await this.#pool.query(`delete from Users where userid=${id}`);  
    }

    async editUser(id, UserObj) {
        if(UserObj.password === ''){
            await this.#pool.query(`update Users set firstname='${UserObj.firstname}',
            lastname='${UserObj.lastname}', middlename='${UserObj.middlename}', login='${UserObj.login}',
            roleid='${UserObj.roleid}'
            where userid=${id}`);
        }
        else {
            UserObj.password = bcrypt.hashSync(UserObj.password, 7);
            await this.#pool.query(`update Users set firstname='${UserObj.firstname}',
            lastname='${UserObj.lastname}', middlename='${UserObj.middlename}', login='${UserObj.login}',
            password='${UserObj.password}', roleid='${UserObj.roleid}' where userid=${id}`); 
        } 
    }
}

module.exports = new Users();
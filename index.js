let express = require('express');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');

const db = require('./DB');
const Comments = require('./Comments');
const Films = require('./Films');
const Genres = require('./Genres');
const Actors = require('./Actors');
const Countries = require('./Countries');
const Users = require('./Users');
const app = express();
const cors = require('cors');
const {secret} = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

const PORT = 4000;

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
  });

app.get('/hitFilms', async function(req, res){
    try {
        const data = await db.getHitFilms();
        res.send(data);
    }
    catch {

    }
})

app.get('/film/:id', async function(req, res){
    try {
        const data = await db.getFilm(req.params.id);
        res.send(data);
    }
    catch {

    }
})

app.get('/actor/:id', async function(req, res){
    try{
        const data = await db.getActor(req.params.id);
        data.actorid = Number(req.params.id);
        res.send([data]);
    }
    catch {

    }
})

app.get('/filmsByName', async function(req, res){
    //http://localhost:4000/films?name=Павук
    try {
        const data = await db.getFilmFilter(req.query);
        res.send(data);
    }
    catch {
        
    }
})

app.get('/films', async function(req, res) {
    const data = await Films.getFilms();
    res.send(data);
})

app.get('/delFilm/:id', async function(req, res) {
    await Films.delFilm(req.params.id)
})

app.get('/actorsByName', async function(req, res){
    try {
        const data = await db.getActorByName(req.query);
        res.send(data);
    }
    catch {
        
    }
})

app.get('/actors', async function(req, res){
    const data = await Actors.getActors();
    res.send(data);
})

app.get('/selComments/:id', async function(req, res) {
    try {
        const data = await Comments.getSelComments(req.params.id);
        res.send(data);
    }
    catch {
        
    }
})

app.get('/genres', async function(req, res) {
    const data = await Genres.getGenres();
    res.send(data);
})

app.post('/addComment', async function(req, res) {

    try {
        const data = await Comments.addCommnent(req.body);
    }
    catch {
        
    }
})

app.post('/addActor', async function(req, res) {
    await Actors.addActor(req.body);
})

app.post('/delActor/:id', async function(req, res) {
    await Actors.delActor(req.params.id);
})

app.post('/filmsByGenres', async function(req, res) {
    const data = await Films.getFilmsByGenres(req.body);
    res.send(data);
})

app.post('/editActor/:id', async function(req, res) {
    await Actors.editActor(req.params.id, req.body);
})

app.post('/addGenre', async function(req, res) {
    try{
        await Genres.addGenre(req.body);
    }
    catch(e) {
        console.log(e)
    }
})

app.post('/addCountry', async function(req, res) {
    console.log(req.body)
    await Countries.addCountry(req.body);
})

app.get('/genre/:id', async function(req, res) {
    const data = await Genres.getGenre(req.params.id);
    data.genreid = Number(req.params.id);
    res.send(data);
})

app.get('/delGenre/:id', async function(req, res) {
    await Genres.delGenre(req.params.id);
})

app.post('/editGenre/:id', async function(req, res) {
    await Genres.editGenre(req.params.id, req.body);
})

app.get('/country/:id', async function(req, res) {
    const data = await Countries.getCountry(req.params.id);
    data.countryid = Number(req.params.id);
    res.send(data);
})

app.get('/delCountry/:id', async function(req, res) {
    await Countries.delCountry(req.params.id);
})

app.post('/addCountry', async function(req, res) {
    await Countries.addCountry(req.body);
})

app.post('/editCountry/:id', async function(req, res) {
    console.log(req.params.id, req.body)
    await Countries.editCountry(req.params.id, req.body);
})

app.get('/countries', async function(req, res) {
    const data = await Countries.getCountries();
    res.send(data);
})

app.get('/commentsByDate', async function(req, res){
    const data = await Comments.getCommentsByDate(req.query);
    res.send(data);
})

app.get('/delComment/:id', async function(req, res){
    await Comments.delComment(req.params.id);
})

app.post('/addFilm', async function(req, res) {
    console.log(req.body)   
    await Films.addFilm(req.body);
})

app.post('/addUser', async function(req, res) {
    const k = await Users.addUser(req.body);
    res.send({status: k});
})

app.post('/loginUser', async function(req, res) {
    return await Users.loginUser(req, res);
})

app.get('/getRole', async function(req, res){
    const token = req.headers.authorization.split(' ')[1];
    res.send(jwt.verify(token, secret));
})

app.post('/editFilm', async function(req, res) {
    await Films.editFilm(req.body);
})

app.get('/users', async function(req, res) {
    const data = await Users.getUsers();
    res.send(data);
})

app.get('/user/:id', async function(req, res) {
    const data = await Users.getUser(req.params.id);
    res.send(data);
})

app.get('/delUser/:id', async function(req, res) {
    await Users.delUser(req.params.id);
})

app.post('/editUser/:id', async function(req, res){
    await Users.editUser(req.params.id, req.body);
})







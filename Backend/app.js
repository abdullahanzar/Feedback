const express = require("express")
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

const FeedbackUser = mongoose.model('Feedback-User', {
    name: String,
    email: String,
    mobile: Number,
    password: String
})

const FeedbackProduct = mongoose.model('Feedback-Product', {
    companyName: String,
    category: Array, 
    logoURL: String,
    productLink: String, 
    productDescrip: String
})

async function authenticate(email, password) {
    const user = await FeedbackUser.findOne({email})
    if(!user)
    return false;
    const fetchedPassword = user.password;
    const auth = await bcrypt.compare(password, fetchedPassword)
    if(auth===true)
    return user.name;
    else 
    return false;
}

const isAuthenticated = async(req, res, next) => {
    const token = req.headers.token;
    try {
        const verify = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch(e) {
        res.json({error: "Sign In First", err: e})
        return
    }
    next();
}

app.get('/', (req, res)=>{
    res.json({
        Welcome: "To The Feedback Server",
        ServerHealth: "Looks okay, go to /health to check more"
    })
})

app.get('/health', (req, res)=>{
    if(mongoose.connection.readyState==1)
    res.json({
        Server: 'IS RUNNING ON THE DESIGNATED PORT',
        Database: 'Connection is succesful'
    })
    else 
    res.json({
        Server: 'IS RUNNING ON THE DESIGNATED PORT',
        Database: 'There is some problem connecting to the database'
    })
})

app.post('/register', async (req, res)=>{
    const {name, email, mobile, password} = req.body;
    if(await FeedbackUser.findOne({email: email})) {
        res.json({error: "user already exists"})
    }
    else if(!email || !name || !mobile || !password) {
        res.json({error: "sent empty body"})
    }
    else {
    try {
        const encryptedPassword = await bcrypt.hash(password, 4)
        await FeedbackUser.create({
            name,
            email,
            mobile,
            password: encryptedPassword,
        })
        res.json({Success: "All Good",
                user: name});
    }
    catch (e) {
        res.json({error: e});
    }
    }
}
)

app.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) {
        res.json({error: "sent empty body"})
    }
    else {
    const authentication = await authenticate(email, password);
    if(authentication) {
        try {
        const jwtToken = await jwt.sign({email, password}, process.env.JWT_SECRET_KEY, { expiresIn: 1800})
        res.json({
            authentication: true,
            login: "successful",
            token: jwtToken,
            user: authentication
        })
        }
        catch(e) {
            res.json({
                error: e
            })
    }
    }
    else {
        res.json({
            error: "Authentication failed",
            login: "unsuccessful",
            authentication: false
        })
        }
    }
})

app.post('/feedback', isAuthenticated, async (req, res)=>{
    let {companyName, category, logoURL, productLink, productDescrip} = req.body;
    if(!companyName || !category || !logoURL || !productLink || !productDescrip)
    res.json({error: "Body is incomplete."})
    else {
        category = category.split(',');
        try {
            await FeedbackProduct.create({companyName, category, logoURL, productLink, productDescrip})
            res.json({Success: "All Good"})
        }
        catch(e) {
            res.json({error: e})
        }
    }
})

app.get('/feedback', async(req, res)=>{
    try {
        const found = await FeedbackProduct.find();
        res.json(found)
    }
    catch(e) {
        res.json({error: e})
    }
})

app.use('/', (req, res)=>{
    res.status(404)
    res.json({
        error: 'URL NOT FOUND'
    })
}) 

app.listen(process.env.SERVER_PORT, async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log('Connected to the Database successfully')
    } catch(e) {
        console.log('Connection to the databasee unsuccessful')
        console.log(e)
    }
})
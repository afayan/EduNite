import dotenv from 'dotenv'
import express, { json } from 'express'
import mysql from 'mysql2'

const app = express()

dotenv.config()
app.use(express.json())
const port = process.env.PORT || 9000

const db = mysql.createConnection({
    user: 'root',
    password: process.env.MYSQL,
    database: 'edunite',
    host: 'localhost'
})


db.query('create table if not exists users(userid int primary key auto_increment ,email varchar(256) unique not null, username varchar(256) not null, password varchar(300))', [], (err, res)=>{

    if (err) {
        console.log(err);
    }
    else{
        console.log("MYSQL connected");
    }
})


app.post('/api/signup', (req, res)=>{

    const {email, password, username} = req.body
    
    db.query('insert into users(email, username, password) values (? , ? , ?);', [email, username, password], (err, result)=>{
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                return res.json({status: false, message : 'Email already in use'}) 
            }
            else if (err.code == 'ER_DATA_TOO_LONG') {
                return res.json({status: false, message : 'Data too long'})
            }

            else if (err.code = 'ER_BAD_NULL_ERROR'){
                return res.json({status : false, message : 'Required  field is missing'})
            }

            console.log(err);
            
            return res.json({status: false, message : 'An error ocurred'})
        }


        return res.json({status: true, message: 'Sign Up complete!'})
    })

})

app.post('/api/login', (req, res)=>{
    
    const {email, password} = req.body


    db.query('select * from users where email = ? and password = ?;',[email, password],(err, result) =>{
        if (err) {
            res.json({status : false, message : 'An error occurred'})
        }

        else if (result.length === 0) {
            res.json({status : false, message : 'Invalid credentials'})
        }

        else{
            res.json({status : true, message : 'Login successful'})
        }
    } )
    
})

app.listen(port, (req, res)=>{
    console.log("App is running on port "+port);
})


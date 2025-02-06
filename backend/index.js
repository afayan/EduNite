import dotenv from "dotenv";
import express, { json } from "express";
import mysql from "mysql2";
import usermodel from "./database.js";
// import db from "./SQL.js";

const app = express();

dotenv.config();
app.use(express.json());
const port = process.env.PORT || 9000;



app.post("/api/signup",async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.json({status : false, message : "Please fill all fields"})
  }

  try {
    const result = new usermodel({ email, username, password})
    await result.save()
  
    console.log(result);
    
    res.json({status : true, message : "Sign Up complete!"})
  } catch (error) {

    if (error.code === 11000){
      return res.json({status : false, message : "Email not unique", err : error})
    }

    if (error.name === 'ValidationError'){
      return res.json({status : false, message : "Invalid data", err : error})
    }
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({status : false, message : "Please fill all fields"})
  }

  const user = await usermodel.findOne({
    email : email,
    password : password
  })

  console.log(user);
  

  if (user) {
    res.json({ status: true, message: "Success", user: user });
  }

  else{
    res.json({ status: false, message: "Invalid credentials",  });
  }
  
});

app.listen(port, (req, res) => {
  console.log("App is running on port " + port);
});

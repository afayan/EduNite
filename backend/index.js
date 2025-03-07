import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose"; 
import usermodel from "./dbs/users.js";
import coursemodel from "./dbs/coursesdb.js";
import enrolledmodel from "./dbs/enrolled.js";
import commentsmodel from "./dbs/comments.js";
import adminModel from "./dbs/admins.js";
import videomodel from "./dbs/videos.js";
import bcrypt from "bcryptjs"; 
import multer from "multer";
import { v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from 'multer-storage-cloudinary'




const app = express();
app.use(express.json());

const port = process.env.PORT || 9000;


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));


  //cloudinary here

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "videos", // Cloudinary folder name
      resource_type: "video", // Ensure it's a video upload
    },
  });

  const upload = multer({ storage });



//  Added GET route to fetch user by email
app.get("/api/get-user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.json({ status: false, message: "Email is required" });
  }

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    res.json({ status: true, user });
  } catch (error) {
    res.json({ status: false, message: "Error fetching user", error });
  }
});

// Secure Sign-up with password hashing
app.post("/api/signup", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.json({ status: false, message: "Please fill all fields" });
  }

  try {
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.json({ status: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usermodel({ email, username, password: hashedPassword });
    await newUser.save();

    res.json({ status: true, message: "Sign Up complete!" });
  } catch (error) {
    res.json({ status: false, message: "Error signing up", error });
  }
});

// Secure Login with password verification
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: false, message: "Please fill all fields" });
  }

  try {
    const user = await usermodel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    res.json({ status: true, message: "Login successful", user });
  } catch (error) {
    res.json({ status: false, message: "Error logging in", error });
  }
});

//  Add a new course
app.post("/api/addcourse", async (req, res) => {
  const { cname, category, faculty , description} = req.body;

  if (!cname || !category || !faculty || !description) {
    return res.json({ status: false, message: "All fields are required" });
  }

  try {
    const newCourse = new coursemodel({ cname, category, faculty, description });
    await newCourse.save();
    res.json({ status: true, message: "Course created", details: newCourse });
  } catch (error) {

    if (error.code === 11000) {
      return res.json({ status: false, message: "Course already exists", error });  
    }

    res.json({ status: false, message: "Error creating course", error });
  }
});

//  Enroll a user in a course
app.post("/api/enroll", async (req, res) => {
  const { userid, courseid } = req.body;

  

  if (!userid || !courseid) {
    return res.json({ status: false, message: "User ID and Course ID are required" });
  }


  const buffer = await enrolledmodel.find({userid : userid, courseid : courseid})

  if (buffer.length > 0) {
   return res.json({ status: false, message: "Already enrolled" });
  }

  try {
    const enrollment = new enrolledmodel({ userid, courseid });
    await enrollment.save();
    res.json({ status: true, message: "Enrolled successfully" });
  } catch (error) {
    res.json({ status: false, message: "Error enrolling", error });
  }
});

//  Show courses enrolled by a user
app.post("/api/showmycourses", async (req, res) => {
  const { userid } = req.body;

  if (!userid) {
    return res.json({ status: false, message: "User ID is required" });
  }

  try {
    const enrolledCourses = await enrolledmodel.find({ userid });
    const allCourses = await coursemodel.find();
    const courseMap = new Map(allCourses.map((c) => [c._id.toString(), c]));

    const result = enrolledCourses.map((e) => courseMap.get(e.courseid)).filter((course) => course);

    res.json({ status: true, message: "Enrolled courses retrieved", courses: result });
  } catch (error) {
    res.json({ status: false, message: "Error fetching courses", error });
  }
});

//  Add a comment
app.post("/api/addcomment", async (req, res) => {
  const { user, video, comment } = req.body;

  if (!user || !video || !comment) {
    return res.json({ status: false, message: "All fields are required" });
  }

  try {
    const newComment = new commentsmodel({ videodata: video, comment, user });
    await newComment.save();
    res.json({ status: true, message: "Comment added successfully" });
  } catch (error) {
    res.json({ status: false, message: "Error adding comment", error });
  }
});

//  Get comments for a specific video
app.get("/api/getcomments/:video", async (req, res) => {
  const video = req.params.video;

  try {
    const comments = await commentsmodel.find({ videodata: video });
    const users = await usermodel.find();
    const usersMap = new Map(users.map((u) => [u._id.toString(), u.username]));

    comments.forEach((c) => {
      c.user = usersMap.get(c.user);
    });

    res.json({ status: true, updateddata : comments });
  } catch (error) {
    res.json({ status: false, message: "Error fetching comments", error });
  }
});

// Check login (testing endpoint)
app.post("/api/checklogin", async (req, res) => {
  res.json({ status: true, data: req.body });
});
//  Start the server
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// update password route
app.post("/api/update-password", async (req, res) => {
  console.log(req.body);
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.json({ status: false, message: "All fields are required" });
  }

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ status: false, message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    res.json({ status: false, message: "Error updating password", error });
  }
});

app.get('/api/allcourses',async (req, res) => {
  const courseData = await coursemodel.find({})
  res.json({ status : true, courses : courseData})  
})

app.post('/api/fun', (req, res)=>{
  res.json({message : "Fun"})
})

app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    const videoUrl = req.file.path; // Cloudinary video URL

    const {title, courseid, description} = req.body

    console.log("video uploaded");
    
    if (!videoUrl) {
      return res.json({ success: false, message: "unable to upload video" });
    }

    

    const newvideo = new videomodel({title, 
      videoUrl, courseid, description
    })

    await newvideo.save()

    console.log("video saved");
    

    return res.json({ success: true, url: videoUrl });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

app.get("/api/getvideos/:cid",async (req, res)=>{
  const cid = req.params.cid

  if (!cid){
    return res.json({})
  }


  const videos = await videomodel.find({courseid : cid})

  return res.json({videos})


})

app.get('/api/video/:vid',async (req, res)=>{

  try {

    const vid = req.params.vid


    const videodata = await videomodel.find({
      _id : vid
    })


    if (videodata.length === 0) {
      return res.json({status : false})
    }
  
    return res.json({status : true ,data : videodata})  

  } catch (error) {
    
    return res.json({status : false, err : error})

  }


})

function checkAdmin(req, res, next) {
  
  

}

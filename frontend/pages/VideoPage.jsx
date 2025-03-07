import React, { useEffect, useRef, useState } from "react";
import './VideoContainer.css'
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useLogin from "../hooks/useLogin";

function VideoPage() {

    const {course, video} = useParams()
    const [comments, setComments] = useState([])
    const [loading, userid, islogged] = useLogin()
    const commentref = useRef()
    const navigate = useNavigate()
    const [vurl, setvurl] = useState(null)
    const [vdata, setvdata] = useState(null)
    const [title, settitle] = useState('Loading')
    const [videos, setvideos] = useState([])
    

    useEffect((()=>{

        
        
        if (loading) {
            return
        }

        if (!loading && !islogged) {
            navigate('/login')
            return
        }

        if (!course || !video || !userid.email){
            return
        }
        console.log(loading, islogged, course, video, userid);

        //work on course and video 
        // addComment(userid._id, video, "I love you")
        getcomments(video)
        getVideodata(video)
        getVideos(course)
        

    }), [course, video, islogged, loading])

    async function getVideos(cid) {
        console.log(cid);
        
        const resp = await fetch('/api/getvideos/'+cid)
        const data = await resp.json()
        console.log(data["videos"]);
        
        setvideos(data["videos"])
      } 

    async function getVideodata(video) {

        //need other videos in playlist
        //need data for video
        
        const response = await fetch('/api/video/'+video)
        const data = await response.json()

        console.log(data);
        
        if (data.status) {
            setvurl(data.data[0].videoUrl)
            console.log(data.data[0]);
            settitle(data.data[0].title)
            
        }

    }


    async function getcomments(video) {
        const result = await fetch('/api/getcomments/'+video)
        const data = await result.json()
        if (data.status) {
            console.log(data.updateddata);
            
            setComments(data.updateddata)
        }
    }

    async function addComment() {
        if (loading) {
            return
        }

        const user = userid._id
        const comment = commentref.current.value
        // const video = video

        if (!comment.trim()) {
            return
        }
    
        const result = await fetch('/api/addcomment', {
            method : 'post',
            headers : {
                'content-type' : 'Application/json'
            },
            body : JSON.stringify({
                user: user,
                video : video,
                comment : comment
            })
        })


        const data = await result.json()


        console.log(data);

        commentref.current.value = ''

        getcomments(video)
        
    }
    

  return (
    <div className="videopage">

    <div className="leftside">

    <h1>{title}</h1>

    <div className="videocontainer">
      <video src={vurl} controls></video>
    </div>

    <div className="commentsdiv">

        <button onClick={()=>addComment()}>Post</button>
        <input type="text" name="" id="" ref={commentref}/>

        <div className="commentroll">
        {
            comments.map((c)=>{
                let d = new Date(c.date)
                return <div key={c._id} className="comment"><p>{c.user}</p> {c.comment}
                <p>{d.toDateString()}</p>
                </div>
            })
        }

        </div>

    </div>

    </div>

    <div className="playlistdiv">

        <h1>Others in the playlist</h1>

        {videos.map((v)=>{

            return <div onClick={()=>navigate('/video/' + course+"/" +v._id)} className={"playlistelement "+(v._id == video ? "selected" : '')} key={v._id}><p>{v.title}</p></div>
        })}
    </div>
    </div>
  );
}

export default VideoPage;

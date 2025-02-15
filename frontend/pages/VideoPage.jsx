import React, { useEffect, useRef, useState } from "react";
import './VideoContainer.css'
import { useParams, useSearchParams } from "react-router-dom";
import useLogin from "../hooks/useLogin";

function VideoPage() {

    const {course, video} = useParams()
    const [comments, setComments] = useState([])
    const [loading, userid, islogged] = useLogin()
    const commentref = useRef()

    useEffect((()=>{

        
        
        if (loading) {
            return
        }

        if (!loading && !islogged) {
            alert("NOT VALID USER")
        }

        if (!course || !video || !userid.email){
            return
        }
        console.log(loading, islogged, course, video, userid);

        //work on course and video 
        // addComment(userid._id, video, "I love you")
        getcomments(video)
        

    }), [course, video, islogged, loading])


    async function getcomments(video) {
        const result = await fetch('/api/getcomments/'+video)
        const data = await result.json()
        if (data.status) {
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


    <div className="videocontainer">

      <iframe
        width="900"
        height="520"
        src="https://www.youtube.com/embed/rm3i6cIxcFE?si=7TGzHxVehtp5sksY"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>

    </div>

    <div className="commentsdiv">

        <button onClick={()=>addComment()}>Post</button>
        <input type="text" name="" id="" ref={commentref}/>

        <div className="commentroll">
        {
            comments.map((c)=>{
                let d = new Date(c.date)
                return <div className="comment"><p>{c.user}</p> {c.comment}
                <p>{d.toDateString()}</p>
                </div>
            })
        }

        </div>

    </div>

    </div>

    <div className="playlistdiv">

        <h1>My Videos</h1>

        <div className="playlistelement">Video</div>
        <div className="playlistelement">Video</div>
        <div className="playlistelement">Video</div>
        <div className="playlistelement">Video</div>
        <div className="playlistelement">Video</div>
    </div>
    </div>
  );
}

export default VideoPage;

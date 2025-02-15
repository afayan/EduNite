import React, { useEffect } from "react";
import './VideoContainer.css'
import { useParams } from "react-router-dom";

function VideoPage() {

    const {course, video} = useParams()

    useEffect((()=>{


        if (!course || !video){
            return
        }

        console.log(course, video)
        //work on course and video
        
        

    }), [course, video])
    

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

        <button>Post</button>
        <input type="text" name="" id="" />

        <div className="commentroll">
        <div className="comment">Good video. Pls upload more</div>
        <div className="comment">Good video. Pls upload more</div>
        <div className="comment">Good video. Pls upload more</div>
        <div className="comment">Good video. Pls upload more</div>
        <div className="comment">Good video. Pls upload more</div>

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

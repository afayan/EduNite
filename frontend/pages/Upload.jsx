import React, { useEffect, useState } from 'react'

function Upload() {

  //take video name
  //take video file
  //take course

  const [video, setVideo] = useState(null)
  const [videoUrl, setVideoURL] = useState("")
  

  async function handleUpload(e) {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("video", video)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formdata,
      });

      const data = await response.json();
      if (data.success) {
        // setVideoUrl(data.url);
        console.log(data.url);
        
      }
    } catch (err) {
      console.error("Error uploading video:", err);
    }

  }


  return (
    <>
    <div className="uploadvideo">
      <h1>Upload</h1>
      <input type="text" placeholder='file name' />
      <input type="file" accept='video/*' onChange={(e) => setVideo(e.target.files[0])}/>

      <button onClick={handleUpload}>Upload</button>

    </div>
    </>
  )
}

export default Upload
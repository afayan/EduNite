import React, { useRef } from 'react'
import './AddCourse.css'

function AddCourse() {

    const cnameref = useRef(0)
    const facref = useRef(0)
    const subjectref = useRef(0)
    const descref = useRef(0)

    async function addCourse() {

        console.log(subjectref.current.value, descref.current.value);
        

        const response = await fetch('/api/addcourse', {
            method : 'post',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({
                cname : cnameref.current.value,
                category : subjectref.current.value,
                faculty : facref.current.value,
                description : descref.current.value
            })
        })
        const data = await response.json()

        console.log(data);
        
    }



  return (
    <>

    <div className="inputform">
        <h1>Create course</h1>
        <input ref={cnameref} type="text" placeholder='Course name'/>
        <input ref={facref} type="text" placeholder='Faculty name'/>
        <select ref={subjectref} name="" id="" >
        <option value="">Select course subject</option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
            <option value="finance">Finance</option>
        </select>
        <textarea ref={descref} name="" id="" rows={5}></textarea>
        <button onClick={()=>addCourse()}>submit</button>
    </div>

    </>
  )
}

export default AddCourse
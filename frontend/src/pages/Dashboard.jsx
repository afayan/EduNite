import React, { useEffect, useState } from 'react'
import useLogin from '../hooks/useLogin'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'


function Dashboard() {

  const [checking, userid, islogged, admin] = useLogin()

  const [courseProg, setCourseProgs] = useState([])
  const [mycourses, setMycourses] = useState([])
  const [morecourses, setmorecourses] = useState([])
  const [dloading, setdloading] = useState(true)
  const navigate = useNavigate()

  if (!checking && !islogged) {

    if (admin) {
      navigate('/')
      alert("admin")
    }

    alert("Not logged")
  }


  useEffect(()=>{

    if (sessionStorage.getItem('auth')){
      
      getcourses()
    }

    async function getcourses(){
      const r1 = await fetch('/api/showmycourses', {
        method: 'post',
        headers : {
          'Content-type' : 'application/json'
        },

        body: JSON.stringify({
          userid : JSON.parse(sessionStorage.getItem('auth'))._id

        })
      })

      const d1 = await r1.json()

      console.log(d1);
      setMycourses(d1.courses)

      const r2 = await fetch('/api/allcourses')
      const d2 = await r2.json()

      console.log(d2);
      setmorecourses(d2.courses)
      
    }

    

  }, [userid])


  async function enroll(C_id) {

    const r1 = await fetch('/api/enroll', {
      method: 'post',
      headers : {
        'Content-type' : 'application/json'
      },

      body: JSON.stringify({
        userid : JSON.parse(sessionStorage.getItem('auth'))._id,
        courseid : C_id
      })
    })

    const d1 = await r1.json()

    console.log(d1);
    
  }

  const courseProgress = [
    { id: 1, title: 'React Fundamentals', progress: 75 },
    { id: 2, title: 'Advanced CSS', progress: 50 },
    { id: 3, title: 'JavaScript ES6+', progress: 90 },
    { id: 3, title: 'Nodejs', progress: 90 }
  ];

  // Sample data for my courses
  const myCourses = [
    { id: 1, cname: 'React Fundamentals', instructor: 'Jane Doe', completionRate: 75, image: '/api/placeholder/300/200' },
    { id: 2, cname: 'Advanced CSS', instructor: 'John Smith', completionRate: 50, image: '/api/placeholder/300/200' },
    { id: 3, cname: 'JavaScript ES6+', instructor: 'Alex Johnson', completionRate: 90, image: '/api/placeholder/300/200' }
  ];

  // Sample data for more courses
  const moreCourses = [
    { _id: 4, cname: 'Node.js Basics', faculty: 'Sarah Williams', rating: 4.8, image: '/api/placeholder/300/200' },
    { _id: 5, cname: 'Python for Beginners', faculty: 'Mike Brown', rating: 4.6, image: '/api/placeholder/300/200' },
    { _id: 6, cname: 'UI/UX Design Principles', faculty: 'Lisa Chen', rating: 4.9, image: '/api/placeholder/300/200' },
    { _id: 7, cname: 'Data Structures & Algorithms', faculty: 'Robert Miller', rating: 4.7, image: '/api/placeholder/300/200' }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-profile">
          <span className="username">User Name</span>
          <div className="avatar-placeholder"></div>
        </div>
      </header>

      <section className="charts-section">
        <h2>Your Progress</h2>
        <div className="charts-container">
          {courseProgress.map(course => (
            <div key={course.id} className="chart-item">
              <div className="chart-circle">
                <div className="chart-value">{course.progress}%</div>
              </div>
              <p className="chart-title">{course.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-courses-section">
        <h2>My Courses</h2>
        <div className="courses-container">
          {mycourses.map(course => (
            <div onClick={()=>navigate('/course/'+ course._id)} key={course._id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.cname} />
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.completionRate}%` }}>
                  </div>
                </div>
              </div>
              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="instructor">Instructor: {course.faculty}</p>
                <p className="completion">Completion: {course.completionRate}%</p>
                <button className="continue-btn">Continue Learning</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="more-courses-section">
        <h2>More Courses</h2>
        <div className="courses-container">
          {morecourses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.cname} />
                <div className="rating">★ {course.rating}</div>
              </div>
              <div className="course-info">
                <h3>{course.cname}</h3>
                <p className="instructor">Instructor: {course.faculty}</p>
                <p className="rating-text">Rating: {course.rating}/5.0</p>
                <button className="enroll-btn" onClick={()=>enroll(course._id)}>Enroll Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>© 2025 Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard
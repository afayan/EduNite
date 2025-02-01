import React, { useRef, useState } from "react";

function Login() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameref = useRef();
  const passwordref = useRef();
  const usernameref = useRef();
  const emailref = useRef();
  const repeatpasswordref = useRef();

  async function handleSignup() {

    setError('')
    setSuccess('')

    let password = passwordref.current.value
    let username = usernameref.current.value.trim()
    let email = emailref.current.value.trim()
    let repeat_password = repeatpasswordref.current.value

    if (!password || !username || !email || !repeat_password) {
        setError('Please fill all data')
        return
    }


    if (password != repeat_password){
        setError("Passwords do not match")
        return
    }

    const response = await fetch('/api/signup', {
        method : 'post',
        headers: {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({
            username: username,
            email : email,
            password : password
        })
    })

    const data = await response.json()


    if (data.status) {
        //true
        setSuccess(data.message)
    }

    else{
        setError(data.message)
    }

  }

  return (
    <div className="loginform">
      <h2>Sign Up</h2>
      <input type="text" ref={usernameref} placeholder="username" />
      <input type="text" ref={emailref} placeholder="email" />
      <input type="password" ref={passwordref} placeholder="password" />
      <input type="password" ref={repeatpasswordref} placeholder="repeat password" />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p className="loginmessage" id="error">{error}</p>}
      {success && <p className="loginmessage" id="success">{success}</p>}
    </div>
  );
}

export default Login;

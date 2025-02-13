import React from 'react'
import useLogin from '../hooks/useLogin'

function Dashboard() {

  const [checking, userid, islogged] = useLogin()

  if (!checking && !islogged) {
    alert("Not logged")
  }

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
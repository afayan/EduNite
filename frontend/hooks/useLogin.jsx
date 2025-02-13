import React, { useEffect, useState } from 'react'

function useLogin() {
  
    const [checking, setChecking] = useState(true)
    const [userid, setuserid] = useState(null)
    const [islogged, setIsLogged] = useState(false)

    useEffect(()=>{

        async function call() {
            const auth = sessionStorage.getItem('auth')

            //check if auth object exists in localstorage

            if (!auth){
                setChecking(false)
                setIsLogged(false)
                return
            }

            //fetch user data
        
            const result = await fetch('/api/checklogin', {
                method : "post",
                headers: {
                    "Content-type": "application/json",
                },
                body: auth
            })
        
            const data = await result.json()
        
            if (data.status) {
                setIsLogged(true)
                setuserid(data.user)
            }
        
            setChecking(false)
        }

        call()
    }, [])


    return [checking, userid, islogged]

}

export default useLogin
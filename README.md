# EduNite

### how to configure and run
1. Navigate to the backend folder
2. Create a .env file right beside the index.js file
3. Create .env file with variable names EXACTLY like this
```
PORT = 9000
MONGO_URL='<YOUR MONGODB URL>'
```
4. create 2 terminals, navigate one terminal inside backend folder and one in frontend folder
5. Run 
```
npm install
```
on BOTH the terminals

6. Run
```
npm run dev
```
on BOTH the terminals

7. repeat ONLY step 4 and step 6 when you want to run code again later


## The UseLogin hook (devs)

hook used to check if user if logged or not

uselogin hook returns an array with loading, userid and islogged
```
const [loading, userid, islogged] = useLogin()
```

loading - true if program is currently checking
userid - returns a json file with json data. Check it only after loading = false
islogged - returns true if user is logged or else false. Check only after loading = false

how to check if user is logged in:
```
!loading && islogged
```

the useLogin hook uses sessionstorage

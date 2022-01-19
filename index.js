const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')
const {logRequest} = require('./generalHelpers')
const { v4: uuidv4 } = require("uuid");
const { validateUser } = require("./userHelpers");

app.use(bodyParser.json())
/*
https://www.youtube.com/playlist?list=PLdRrBA8IaU3Xp_qy8X-1u-iqeLlDCmR8a
Fork the project 
git clone {url}
npm i


Create server with the following end points 
POST /users with uuid, unique username 
PATCH /users/id 
GET /users with age filter 
Create Error handler 
POST /users/login /sucess 200 , error:403
GET /users/id   200,   eror:404
DELETE users/id  200,    error:404
complete middleware for validating user
Create Route For users 

Bonus
Edit patch end point to handle the sent data only
If age is not sent return all users


git add .
git commit -m "message"
git push
*/

app.post("/users", validateUser, async (req, res, next) => {
  try {
      const { username, age, password } = req.body;
      const data = await fs.promises
          .readFile("./user.json", { encoding: "utf8" })
          .then((data) => JSON.parse(data));
      const id = uuidv4();
      data.push({ id, username, age, password });
      await fs.promises.writeFile("./user.json", JSON.stringify(data), {
          encoding: "utf8",
      });
      res.send({ id, message: "sucess" });
  } catch (error) {
      next({ status: 500, internalMessage: error.message });
  }
});

app.patch("/users/:userId", validateUser, async (req, res, next) => {

  try {
    const{ username,password,age} = req.body;
    const users = await fs.promises
    .readFile('./user.json',{encoding: 'utf-8'} )
    .then((data)=> JSON.parse(data));
    const newUsers = users.map((user)=> {
      if(user.id !== req.params.userId) return user;
      return {
        username,
        age,
        id: req.params.userId,
      };
      
  
  
    });
  await fs.promises.writeFile('./user.json', JSON.stringify(newUsers),{encoding:"utf8"})
  
  res.status(200).send({message:"user edited"});
  } catch ( error){
    next({status: 500, internalMessage: error.message });
  }
  });


  

   app.post('/users/login', (req, res,next) => {
     fs.readFile('./user.json',(err,data)=>{
       const arr= JSON.parse(data)
       const user =arr.find (user=>user.username==req.body.username)&& (user.password==req.body.password)
       if(!user){ return next( {status:403, message:"user name or password incorrect"})
     }return res.status(200).send({message:"logged in sucessfully"})
      })
    })
app.get('/users', async (req,res,next)=>{
  try {
  const age = Number(req.query.age)
  const users = await fs.promises
  .readFile("./user.json", { encoding: "utf8" })
  .then((data) => JSON.parse(data));
  const filteredUsers = users.filter(user=>user.age===age)
  res.send(filteredUsers)
  } catch (error) {
  next({ status: 500, internalMessage: error.message });
  }

})


app.use((err,req,res,next)=>{if(err.status>=500){console.log(err.internalMessage);
  return res.status(500).send({error:"internal server Error"})
    }
    res.status(err.status).send(err.message)

})


app.delete('/users/:userId', (req, res) => {
    const userIndex = getUserIndex(req.params.userId)
   
    if (userIndex === -1) return res.status(404).json({})
   
    users.splice(userIndex, 1)
    res.json(users)
   })




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const fs = require("fs");
const { validateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
router.post("/users", validateUser, async (req, res, next) => {
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



  router.patch("/users/:userId", validateUser, async (req, res, next) => {
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
    

       router.post('/users/login', (req, res,next) => {
        fs.readFile('./user.json',(err,data)=>{
          const arr= JSON.parse(data)
          const user =arr.find (user=>user.username==req.body.username)&& (user.password==req.body.password)
          if(!user){ return next( {status:403, message:"user name or password incorrect"})
        }return res.status(200).send({message:"logged in sucessfully"})
         })
       })




       router.delete('/users/:userId', (req, res) => {
        const userIndex = getUserIndex(req.params.userId)
       
        if (userIndex === -1) return res.status(404).json({})
       
        users.splice(userIndex, 1)
        res.json(users)
       })
      //  router.post('/login', (req, res) => {
      //   // Insert Login Code Here
      //   let username = req.body.username;
      //   let password = req.body.password;
      //   res.send(`Username: ${username} Password: ${password}`);
      // });
      



module.exports = router;

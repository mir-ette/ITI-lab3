const fs = require('fs')
// some
// find
const validateUser = async (req, res, next) =>{
    try {
        const {username , password} = req.body;
        if(!username)return res.status(422).send({message:"username is required"})
        if(!password)return res.status(422).send({message:"password is required"})
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data)
        const isUsernameExists = users.some(user=>user.username===username)
        if(isUsernameExists && req.method == "POST") return next({status:422, message:"username is used"})
        next()
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
}

module.exports = {
    validateUser
}
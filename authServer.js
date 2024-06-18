require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json())

let referehTokens = []

app.post('/token',(req,res)=>{
  const referehToken = req.body.token
  if(referehToken==null) return res.sendStatus(401)
  if(!referehTokens.includes(referehToken)) return res.sendStatus(403) 
  jwt.verify(referehToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if(err) return res.sendStatus(403)
    const accessToken = generateAccessToken({name:user.name})
    res.json({accessToken: accessToken})
  })
})

app.delete('/logout',(req,res)=>{
  referehTokens = referehTokens.filter(token => token!== req.body.token)
  res.sendStatus(204)
})

app.post('/login',(req,res)=>{
  // Authenticate User
  const username = req.body.username
  const user = {name: username}
  const accessToken = generateAccessToken(user)
  const referehToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  referehTokens.push(referehToken)
  res.json({accessToken: accessToken, referehToken: referehToken})
})


function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15s'})
}



app.listen(4000,()=>console.log(`listening on 4000`))



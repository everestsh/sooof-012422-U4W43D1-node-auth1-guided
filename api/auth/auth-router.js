
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')

router.post('/register', async (req, res, next) => {
    try{
        // pull creds from req.body
        const { username, password } = req.body
        // hash the password w/ bcrypt
        const hash = bcrypt.hashSync(password, 10) // 2 ^ 8
        // console.log(`username:  ${username}, password: ${password}, hash: ${hash}`)
        // store new user in db
        const newUser = {username, password: hash}
        const inserted = await User.add(newUser)
        // respond
        res.json( { message: `Welcome, ${inserted.username}`} )
        // res.json('register!!!')
    } catch (err){
        next(err)
    }
})
router.post('/login', async (req, res, next) => {
    try{
        // pull u/p from req.body
        const { username, password } = req.body
        // pull the user from the db by that username
        const [user] = await User.findBy({ username })
        
        if(user && bcrypt.compareSync(password, user.password)){
            // password good, we can initialize a session!
            req.session.user = user // LOTS 'O MAGIC HERE
            // console.log(req.session)
            res.json({message: `Good to see you again, ${username}`})
        }else {
            next({ status: 401, message: 'Invalid credentials' })
        }
        // server recreates hash from req.body.password // xxxxxxxxxxx
        // server compares 'recreated' against the one in db
        // res.json('login!!!')
    } catch (err){
        next(err)
    }
})

router.get('/logout', async (req, res) => {
    // try{
    //     res.json('logout!!!')
    // } catch (err){
    //     next(err)
    // }
    if(req.session.user){
        req.session.destroy( (err)=>{
            if (err) {
                // set a new cookie in THE PAST
                res.set('Set-Cookie', 'monkey=bar')
                res.json({ message: `sorry, could you retry` })
              } else {
                res.json({ message: `bye, it was awesome` })
              }
        })
    }else{
        res.json({message: `I do not believe we have met?`})
    }
})

module.exports = router
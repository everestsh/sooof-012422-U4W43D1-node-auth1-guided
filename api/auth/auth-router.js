const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const { validateUser, usernameIsUnique ,usernameExists } = require('./auth-middleware');


// http post :9000/api/auth/register username=aaa password=1234 -v
router.post('/register', validateUser, usernameIsUnique,  async (req, res, next) => {
    // res.json('register')
    // const { username, password } = req.body
    // const hash = bcrypt.hashSync(password, 12)  // 2*8
    // console.log(hash)
    // res.end()
    // try{
    //     const user = req.user
    //     const { username, password } = req.body
    //     const hash = bcrypt.hashSync(password, 12)  // 2*8
    //     username.password = hash
    //     let result = await Users.add(user)
    //     res.status(201).json(result)
    // }catch(err){
    //     next(err)
    // }
    try {
        const user = req.user;
        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash;
        let result = await Users.add(user);
        res.status(201).json(result);
    } catch(err) {
        next(err);
    }
});

// http post :9000/api/auth/login username=aaa password=1234 -v
router.post('/login', validateUser, usernameExists, async(req, res, next) => {
    // res.json('login')
    const password = req.body.password;
    // console.log("data password", req.user.password)
    // console.log("body password = ", password)
    // console.log(bcrypt.compareSync(password, req.user.password))
    if( bcrypt.compareSync(password, req.user.password) == true) {
        res.json(`Welcome back, ${req.user.username}!`);
    } else {
        next({ status: 401, message: 'invalid credentials provided!' });
    }
});

router.get('/logout', (req, res, next) => {
    res.json('logout')
});

module.exports = router;
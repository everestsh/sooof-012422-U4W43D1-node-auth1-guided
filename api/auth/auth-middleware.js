
const Users = require('../users/users-model')

function restrict (req, res, next){
    console.log("restrict middleware")
    next()
}
// function validateUser (req, res, next){
//     // console.log("validateUser middleware")
//     // next() 
//     if(!req.body.username || typeof req.body.username != 'string' || !req.body.username.trim()){
//         next({status: 404, message: 'username is required and must be a string'})
//     }else if(!req.body.password || typeof req.body.password != 'string' || !req.body.password.trim()){
//         next({status: 404, message: 'password is required and must be a string'})
//     }else{
//         req.user = {
//             username: req.user.username.trim(),
//             password: req.user.password.trim()
//         }
//         next()
//     }
// }
function validateUser(req, res, next) {
    if(!req.body.username || typeof req.body.username != 'string' || !req.body.username.trim()) {
        next({ status: 400, message: 'username is required and must be a string' });
    } else if(!req.body.password || typeof req.body.password != 'string' || !req.body.password.trim()) {
        next({ status: 400, message: 'password is required and must be a string' });
    } else {
        req.user = {
            username: req.body.username.trim(),
            password: req.body.password.trim(),
        };
        next();
    }
}
async function usernameIsUnique (req, res, next){
    // console.log("usernameIsUnique middleware")
    // next() 
    const exist = await Users.findBy({ username: req.user.username }).first() 
    // console.log(exist)
     if( exist != null) {
        next({ status: 400, message: `user '${req.user.username}' already exists!` });
    } else {
        next();
    }
}
async function usernameExists(req, res, next) {
    const user = await Users.findBy({ username: req.user.username }).first();
    console.log(user)
    if(user == null) {
        next({ status: 400, message: `user '${req.user.username}' does not exist!` });
    } else {
        req.user = user;
        next();
    }
}

module.exports = {
    restrict,
    validateUser,
    usernameIsUnique,
    usernameExists,
}
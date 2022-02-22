const router = require("express").Router()

const Users = require("./users-model.js")

const { restricted } = require('../auth/auth-middleware');
// http :9000/api/users/session
router.get("/session",  (req, res, next) => {
  // res.json("hi!!!")
  res.json(req.session.user)
});
// http :9000/api/users/session
router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
})

module.exports = router

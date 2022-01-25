function protect(req, res, next) {
    // console.log('protecting endpoint!!!')
    // next()
    if (req.session.user) {
        next()
      } else {
        next({ status: 401, message: 'you cannot touch this!' })
      }
}

module.exports = {
    protect,
}
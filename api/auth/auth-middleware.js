function protect(req, res, next) {
    console.log('protecting endpoint!!!')
    next()
}

module.exports = {
    protect,
}
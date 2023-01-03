const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for the authorization header and ensure it is a Bearer token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password')
      
      // Call the next piece of middleware
      next() 
    } catch (error) {
      console.log(error)
      res.status(401) 
      throw new Error('Not authorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

// Format of token sent in the authorization header:
// Bearer <token_contents>

module.exports = { protect }
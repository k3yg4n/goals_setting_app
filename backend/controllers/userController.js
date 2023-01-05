const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const { isErrored } = require('stream')
const { ifError } = require('assert')
const { restart } = require('nodemon')

// @desc   Register new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async(req, res) => {
  const { name, email, password } = req.body

  // Field Verification
  if(!name || !email || !password) {
    res.status(400) // Bad request
    throw new Error('Please ensure all fields are added.') 
  }

  // Check if the user exists
  const userExists = await User.findOne({email})

  if(userExists) {
    res.status(400) 
    throw new Error('User already exists.')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if(user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    }) // Okay message
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})

// @desc   Authenticate a user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body

  // Check for user email
  const user = await User.findOne({email})

  if(user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid Credentials')
  }
  
})

// @desc   Get user data
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler(async(req, res) => {

  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  })
})

// Function to generate JWT
// Signs a new token with the id thats passed in, with the JWT_SECRET used
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
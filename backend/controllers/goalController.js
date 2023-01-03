const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc   Get goals
// @route  GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id })

  res.status(200).json({goals})
})

// @desc   Post goal
// @route  POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  if(!req.body.text){ // Bad request
    res.status(400)
    throw new Error('Please add a text field')
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json({goal})
})

// @desc   Update goal
// @route  PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if(!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  const user = await User.findById(req.user.id)

  // Check if user exists
  if(!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the goal user matches the currently logged in user
  if(goal.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized to update goal')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})

  res.status(200).json(updatedGoal)
})

// @desc   Delete goal
// @route  DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if(!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  const user = await User.findById(req.user.id)

  // Check if user exists
  if(!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the goal user matches the currently logged in user
  if(goal.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized to update goal')
  }

  await goal.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
}
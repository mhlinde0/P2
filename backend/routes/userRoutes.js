const express = require('express')
const router = express().Router()
const User = require('../models/User.js')

//get all users
router.get('/', (req,res) => {
    res.json({mssg: 'GET ALL USERS'})//Dummy
})

//Get a single user
router.get('/:id', (req,res) => {
    res.json({mssg: 'GET SINGLE USER'})//Dummy
})

//POST a new user
router.post('/', async(req,res) => {
    const {name,email,password} = req.body
    try{
        const user = await User.create({name,email,password})
        res.status(200).json(user) //200 means all good
    }catch(error){
    res.status(400).json({error: error.message}) //400 means all bad
    }
    res.json({mssg: 'POST a user'})//Dummy
})

//delete user
router.delete('/:id', (req,res) => {
    res.json({mssg: 'delete user'})//Dummy
})

//Update a user
router.post('/:id', (req,res) => {
    res.json({mssg: 'update user'})//Dummy
})


module.exports= router
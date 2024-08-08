const express = require("express")
const users = require('./MOCK_DATA.json')
const mongoose = require('mongoose')//first require the package , then initialize it with a connection string to our
const fs = require("fs")

const app = express()

const port = 8000 

//Midlleware -- plugin:=>  this middleware is used to take the form data from the front end and put those data into the body
app.use((req, res, next)=>{
    fs.appendFile('log.txt',`\n ${req.id} ; ${req.ip} ; ${Date.now()} ; ${req.method} ; ${req.path} \n`, (err,data)=>{
        next()
    })
})
app.use(express.urlencoded({ extended: false}))
// app.use(express.json())




//FUNCTIONS on '/users'
const getAllUsers = (req, res)=>{
    const html = `
        <ul>
        ${users.map((user)=> `<li>user: ${user.id}</li>
            <li>${user.first_name}</li>
            <li>${user.last_name}</li>
            <li>${user.email}</li>
            <li>${user.gender}</li>
            <li>${user.job_title}</li>`)}
        </ul>`

    return res.send(html)
}

const addUsers = (req,res)=>{
    const body = req.body

    if(!body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({
            status: "Please write all values"
        })
    }
    const id = users.length + 1

    // users.push({
    //     id: users.length + 1,
    //     first_name: body.first_name,
    //     last_name: body.last_name,
    //     email: body.email,
    //     gender: body.gender,
    //     job_title: body.job_title
    // })

    //this is another method
    users.push({id, ...body})
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users), (err,data)=>{
        return res.json({
            statues: "success"
        })
    })
    return res.status(201)
}


//FUNCTIONS on '/users/:id'
const getUser = (req,res)=>{
    const id = Number(req.params.id)
    const userToget = users.find((user)=> user.id === id)

    if(!userToget){
        return res.status(404).json({
            status: 'User not found',
            text: `there is no such user with id: ${id}`
        })
    }

    return res.json(userToget) 
}

const deleteUser = (req, res)=>{
    const id = Number(req.params.id)
    const userToDelete = users.find((user)=> user.id === id)

    if(!userToDelete){
        return res.status(404).json({
            status: 'User not found',
            text: `there is no such user with id: ${id}`
       })
    }

    const index = users.indexOf(userToDelete)

    users.splice(index, 1)

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        res.status(200).json({
            status: 'Success',
            text: `User with id:${id} is successfully deleted`
        })
    })
}

const patchUser = (req,res)=>{
    const id = Number(req.params.id)
    const userToUpdate = users.find((user)=> user.id === id)

    if(!userToUpdate){
       return res.status(404).json({
            status: 'User not found',
            text: `there is no such user with id: ${id}`
        })
    }

    const index = users.indexOf(userToUpdate) //finding the index of the object

    const body = req.body

    Object.assign(userToUpdate, body)
    users[index] = userToUpdate

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        res.status(200).json({
            status: 'Success',
            text: `User with id:${id} is successfully Patched`
        })
    })
}

const putUser = (req,res)=>{
    const id = Number(req.params.id)
    const userToUpdate = users.find((user)=> user.id === id)

    if(!userToUpdate){
        return res.status(404).json({
            status: 'User not found',
            text: `there is no such user with id: ${id}`
        })
    }

    const index = users.indexOf(userToUpdate) //finding the index of the object

    const body = req.body

    Object.assign(userToUpdate, body)
    users[index] = userToUpdate

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        res.status(200).json({
            status: 'Success',
            text: `User with id:${id} is successfully Putted`
        })
    })
}


//SHOWING THE HOMEPAGE
app.get('/api/users',(req,res)=>{
    return res.json(users)
})


//GETTING ALL THE USERS AS API
app.get('/',(req,res)=>{
    const html = `
        <h1>THIS IS THE HOMEPAGE</h1>
        <P>All the users are available at: <a href="http://localhost:${port}/users">http://localhost:${port}/users</a> or <a href="http://localhost:${port}/api/users">http://localhost:${port}/api/users</a></P>
    `
    return res.send(html)
})

// app.get('http://localhost:8000',(req,res)=>{
//     const html = `
//         <h1>THIS IS THE HOMEPAGE</h1>
//         <P>All the users are available at: <a href="http://localhost:${port}/users">http://localhost:${port}/users</a> or <a href="http://localhost:${port}/users">http://localhost:${port}/api/users</a></P>
//     `
//     return res.send(html)
// })


//ROUTING on '/users'
app.route('/users')
    .get(getAllUsers)
    .post(addUsers)


//ROUTING on '/users/:id
app.route('/users/:id')
    .get(getUser)
    .delete(deleteUser)
    .patch(patchUser)
    .put(putUser)


app.listen(port, (req, res)=>{
    console.log(`Server is running on http://localhost:${port}`)
})
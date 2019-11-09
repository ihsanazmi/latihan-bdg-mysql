const conn = require('../connection/index')
const router = require('express').Router()

const bcryptjs = require('bcryptjs')
const validator = require('validator')

// CREATE USER
router.post('/users', (req, res)=>{
    let sql = `INSERT INTO users set ?`
    let data = req.body
    // data = {
    //     username: "joko",
    //     name: "Joko Anwar",
    //     email: "jokoanwar@gmail.com",
    //     password: "1234567" --> "jdkalsu2901ejlwiq4u9wa"
    // }

    if(!validator.isEmail(data.email)) return res.send({error: 'Format email salah'})

    data.password = bcryptjs.hashSync(data.password, 8)

    conn.query(sql, data, (err, result)=>{
        if(err) res.send({error: err.message})

        res.send(result)
    })
})

// GET ALL USER
router.get('/users', (req, res)=>{
    let sql = `SELECT * FROM users`

    conn.query(sql, (err, result)=>{
        if(err) res.send({error: err.message})
        res.send(result)
    })
})

// LOGIN USER
router.post('/users/login', (req, res)=>{

    // body = {
    //     email: "",
    //     password: ""
    // }

    let {email, password} = req.body

    let sql = `SELECT * FROM users WHERE email = '${email}'`
    
    conn.query(sql, async (err, result)=>{
        if(err) res.send({error: err.message}) // err adalah jika ada eror pada saat koneksi ke sql. biasanya error salah syntax query
        // result = [{
        //     username: "budi",
        //     name: "budi anduk",
        //     email: "budianduk@elwin.com",
        //     password: "1234567",      --> decrypt password agar bisa login
        //     avatar: "null",
        //     verify: 0
        // }]
        let user = result[0] 
        let hasil = await bcryptjs.compare(password, user.password)

        if(!hasil){
            return res.send({error: "Password Salah"})
        }
        
        res.send(result)
        
    })

})

module.exports = router


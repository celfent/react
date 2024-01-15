const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json(  ));
app.use(cookieParser());
const corsOptions ={
    origin:'http://localhost:3000', 
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_blog"
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({error: "You are not authorized"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({error: "Token is not okey"});
            } else {                
                req.id = decoded.id;
                req.name = decoded.name;
                req.profession = decoded.profession;
                next();
            }
        })
    }
}

app.get('/homepage', verifyUser, (req, res) => {
    return res.json({
        status: "Success", 
        id: req.id, 
        name: req.name, 
        profession: req.profession, 
        email: req.email,
    });
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (name, profession, email, password) VALUES (?)";
    const values = [
        req.body.name,
        req.body.profession,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            const id = data[0].id;
            const name = data[0].name;
            const profession = data[0].profession;
            const token = jwt.sign({id, name, profession}, "jwt-secret-key", {expiresIn: "1d"});
            res.cookie('token', token);
            return res.json("Success");
        } else {
            return res.json("Login failed");
        }
    })
})

app.post('/logout', (req, res) => {
    res.clearCookie("token");
    return res.json({Status: "Success"});
})

app.post('/works-insert', verifyUser, (req, res) => {
    const { title, description, link } = req.body;
    const id = req.id;

    const sql = "INSERT INTO works (title, description, link, author) VALUES (?, ?, ?, ?)";
    const values = [title, description, link, id];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.get('/works', verifyUser, (req, res) => {
    const id = req.id;
    const sql = "SELECT * FROM works WHERE author = ?";
    const values = [id];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.delete('/works/:id', (req, res) => {
    const sql = "DELETE FROM works WHERE id=?";
    const values = [req.params.id];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.get('/comments', verifyUser, (req, res) => {
    const userId = req.id;

    const getCommentsQuery = "SELECT author, text FROM comments WHERE user = ?";
    db.query(getCommentsQuery, [userId], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.post('/save-comment', verifyUser, (req, res) => {
    const { author, commentText } = req.body;
    const userId = req.id;

    const sql = "INSERT INTO comments (author, text, user) VALUES (?, ?, ?)";
    const values = [author, commentText, userId];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.listen(8081, ()=>{
    console.log("listening");
})

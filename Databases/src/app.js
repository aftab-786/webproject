const express =require('express');
const app = express();
require('./db/conn.js');
const hbs= require('hbs');
var MongoClient = require('mongodb').MongoClient;
var url1 = "mongodb://localhost:27017/login";
app.use(express.static('public'));
const path = require('path');
const register=require('./models/regdetails.js');
const viewspath =path.join(__dirname,"../templates/views");
const partialspath =path.join(__dirname,"../templates/partials");
app.set("views",viewspath);
app.set("view engine","hbs")
app.use(express.urlencoded({extended:false}));
hbs.registerPartials(partialspath);
app.get("/",(req, res) => {
MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
    var dbo = db.db("regdb");
    dbo.collection("userdatas").find({}).toArray(function(err, result) {
      if (err) throw err;
      for(i=0; i<result.length; i++){
          if(result[i].login==1){
         res.render("index",{post:
         { but1:'none',
           but2:'inline',
           but3:'inline',
           but4:result[i].username
        }});
        }
      }
      db.close();
    });
  }); 
}); 
app.get("/signup",(req, res) => {
res.render("signup");
})
app.post("/signup",async(req, res) => {
    try{
    const userrecord=new register({
name:req.body.name,
country:req.body.country,
city:req.body.city,
state:req.body.state,
zip:req.body.zip,
username:req.body.username,
password:req.body.password,
login:0
    })
    const signupstatus=await userrecord.save();
    res.redirect("/login");
}
catch(e){
res.send(e);
res.status(404);
}
})
app.get("/login",(req, res) => {
    res.render("login");
    })
app.post("/login",async(req, res) => {
    try{
        MongoClient.connect(url1, function(err, db) {
            if (err) throw err;
            var dbo = db.db("regdb");
            dbo.collection("userdatas").find({}).toArray(function(err, result) {
              if (err) throw err;
              if(req.body.username==result[0].username)
              {
                var myquery = { username:req.body.username ,login: 0 };
                var newvalues = { $set: {username:req.body.username ,login:1 } };
                dbo.collection("userdatas").updateOne(myquery, newvalues, function(err, res) {
                  if (err) throw err;
                  console.log("1 document updated");
                });
              }
              db.close();
            });
          });
    // const signupstatus=await userrecord.save();
    res.redirect("/");
}
catch(e){
res.send(e);
res.status(404);
}
});
app.listen(3000,() => {"server is listening to 3000 port"});
const ENGEL_DEBUG  = true;
const express = require("express");
const fileUpload = require("express-fileupload")
const fs = require("fs")
const {ImgurClient} = require("imgur")
const app = express();
const bodyparser = require("body-parser");
const mongodb = require("mongodb")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EmailValidator = require("email-validator");
const converBase64ToImage = require('convert-base64-to-image')
const randomstring = require("randomstring")
const User = require("./userschema");
const Report = require("./reportschema")
const cors=require("cors");
const rlmt = require("express-rate-limit")
const TokenGenerator = require( 'token-generator' )({
  salt: 'kaanturgunadamdir',
  timestampMap: '1234567890', // 10 chars array for obfuscation proposes
});
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const rateLimit = rlmt.rateLimit;
const limiter = rateLimit({
	windowMs: 1.5 * 60 * 1000, // 15 minutes
	limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

const KILOMETERS_FOR_ENGELLI = ENGEL_DEBUG ? 0.2 : 0.02   ///////////////////////////////////// IMPORTANT
const cookieParser = require('cookie-parser');
const Token = require("./tokenschema");
app.use(cookieParser());
app.use(cors(corsOptions)) // Use this after the variable declaration

const client = new ImgurClient({
  clientId:"787f04e0731da9d",
  clientSecret: "b275518723e8233079d0528787351dcb1dba0373",
  refreshToken: "9afce0001ef9872e1700c02eeca28a9e467886c6",
})


app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload())

mongoose
  .connect("mongodb://localhost:27017/test")
  .then((r) => console.log("connectod to db"));

app.get("/", (req, res) => {
  console.log("Hello World");
  try {
    const hashedPassword = bcrypt.hashSync("123456", 10);
    const new_user = new User({
      username: "starbutterfly",
      lastphoto: "18/11/2024",
      password: hashedPassword,
      peoplehelped: 10,
      phototaken: 4,
      daystreak: 2,
      email: "barisozcan105@gmail.com",
    });
    new_user.save().then((r) => console.log(r));
  } catch (e) {
    console.log(e);
  }
});

app.post("/signup", (req, res) => {
  if (EmailValidator.validate(req.body.email)) {
    User.findOne({ email: req.body.email }).then((docs, err) => {
      if (docs) {
        res.json({ message: "email already exists" });
      }
      else if (err) {
        console.log("upsideerr")
        res.json({ message: err });
      } else {
        User.findOne({ username: req.body.username }).then((docs, err) => {
          if (docs) {
            res.json({ message: "username already exists" });
          }
          else if (err) {
            console.log("err")
            res.json({ message: err });
          } else {
            if (EmailValidator.validate(req.body.email)) {
                console.log("are you sure")
              const hashedPassword = bcrypt.hashSync(req.body.password, 10);
              const new_user = new User({
                username: req.body.username,
                lastphoto: "0/0/0",
                password: hashedPassword,
                phototaken: 0,
                peoplehelped: 0,
                daystreak: 0,
                email: req.body.email,
                reports:[],
                points:0,
                siralama:0,
                userpp:"https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
              });
              new_user.save().then((r) =>{
                  res.status(200).json({ message: "user created successfully", user: r  })
                } );
            } else {
              res.json({ message: "invalid email" });
            }
          }
        }).catch(e=>{
            res.json({message:e})
        });
      }
    });
  }
});

app.post("/login", (req, res) => {
  console.log("YEAH");
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((docs, err) => {
    if (err) {
      console.log(err);
      res.json({ message: "failed" });
    } else if (docs) {
      bcrypt
        .compare(req.body.password, docs.password)
        .then((response, err) => {
          if (response) {
            res.json({ message: "success" ,username:docs.username,userpp:docs.userpp});
          } else {
            res.json({ message: "failed" });
          }
        })
        .catch((e) => {
          res.json({ message: e });
        });
    } else {
      console.log("no docs");
      res.json({ message: "failed" });
    }
  });
});

client.on("uploadProgress",(progress)=>console.log(progress))

app.post("/updatePhoto",(req,res)=>{
  User.findOne({email:req.body.email}).then((docs,err)=>{
    if(docs){
      bcrypt.compare(req.body.password,docs.password).then((result,err)=>{
        if(result){
          console.log("inside")
      const photoname=randomstring.generate()
      const pathToSaveImage = `./public/${photoname}.jpg`
      const path = converBase64ToImage.converBase64ToImage(req.body.image, pathToSaveImage) 
      client.upload({image:fs.createReadStream(pathToSaveImage),title:photoname}).then((urlObject)=>{"3"
        if(urlObject.data.link){
          console.log(urlObject)
          fs.unlinkSync(pathToSaveImage)
          let today = new Date().toLocaleDateString()
          let description = req.body.description || ""
          User.updateOne({email:req.body.email},{userpp:urlObject.data.link}).then(rr=>{
            res.json({message:"success",userpp:urlObject.data.link})
            }).catch(ee=>{console.log("user",ee);}).catch(e=>{console.log("report error",e);})
        }
      })
        }
        else{
          res.json({message:"invalid password"})
        }
      })
      
    }else if(err){
      res.json({message:"failed to find user", error:err})
    }
    else{
      res.json({message:"failed"})
    }
  }).catch(error=>{
    res.json({message:error})
  })
})


app.post("/uploadreport",(req,res)=>{
  console.log("updating")
  try{
    if(req.body.classification==="manzara" && req.body.description===""){
      res.json({message:"failed",err:"no description for manzara was given !"})
    }else{
      User.findOne({email:req.body.email}).then((docs,err)=>{
        if(docs){
          bcrypt.compare(req.body.password,docs.password).then((result,err)=>{
            if(result){
              console.log("inside")
          const photoname=randomstring.generate()
          const pathToSaveImage = `./public/${photoname}.jpg`
          const path = converBase64ToImage.converBase64ToImage(req.body.file, pathToSaveImage) 
          client.upload({image:fs.createReadStream(pathToSaveImage),title:photoname}).then((urlObject)=>{
            if(urlObject.data.link){
              console.log(urlObject)
              fs.unlinkSync(pathToSaveImage)
              let today = new Date().toLocaleDateString() 
              let description = req.body.description || ""
              const new_report = new Report({
                classification:req.body.classification,
                description:description,
                date:today,
                location_long:req.body.location.longitude,
                location_lat:req.body.location.latitude,
                approved:false,
                fotourl:urlObject.data.link,
                userid:docs._id
              })
              new_report.save().then(r=>{
                console.log(r)
                if(today!==docs.lastphoto){
                  User.updateOne({email:req.body.email},{$push:{reports:r._id},$inc:{daystreak:1},lastphoto:today}).then(rr=>{
                    res.status(200).json({message:"success",report:r,url:urlObject.data.link})
                  }).catch(ee=>{console.log("user",ee);
                  })
                }else{
                  User.updateOne({email:req.body.email},{$push:{reports:r._id}}).then(rr=>{
                    res.status(200).json({message:"success",report:r,url:urlObject.data.link})
                  }).catch(ee=>{console.log("user",ee);
                  })
                }
                ////// update user's reports
                
              }).catch(e=>{console.log("report error",e);
              })
            }
          })
            }
            else{
              res.json({message:"invalid password"})
            }
          })
          
        }else if(err){
          res.json({message:"failed to find user", error:err})
        }
        else{
          res.json({message:"failed"})
        }
      }).catch(error=>{
        res.json({message:error})
      })}
  }catch(e){
    res.json({message:"error",err:e});
  }
  })

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  app.post("/getlocwdistance",(req,res)=>{
    let notified_reports = req.body.notified_reports
    // return reports that getDistanceFromLatLonInKm is less than 2.2km with mongoose
    Report.find({approved:true},{fotourl:1,classification:1,date:1,description:1,location_lat:1,location_long:1,_id:1}).then(reports=>{
      let reportsArray = []
      reports.forEach(report => {
        let distance = getDistanceFromLatLonInKm(report.location_lat,report.location_long,req.body.latidute,req.body.longitude)
        if(distance<KILOMETERS_FOR_ENGELLI && !notified_reports.includes(report._id.toString())){
          console.log("REPORT ID : ", report._id , " İNCLUDES ? ", notified_reports.includes(report._id.toString()))
          reportsArray.push([distance,report])
          }
          }
        
        )
        reportsArray.sort()
        console.log("REPORTS : ",reportsArray)
      res.json({reports:reportsArray,message:"success"})
          }).catch(error=>{
            res.json({message:error})
            })
            
    console.log("Request Maden")
  })

app.post("/getloc",(req,res)=>{
  // return reports that getDistanceFromLatLonInKm is less than 2.2km with mongoose
  Report.find({approved:true},{fotourl:1,classification:1,date:1,description:1,location_lat:1,location_long:1,_id:0}).then(reports=>{
    let reportsArray = []
    reports.forEach(report => {
      let distance = getDistanceFromLatLonInKm(report.location_lat,report.location_long,req.body.latidute,req.body.longitude)
      console.log(distance)
      if(distance<2.2){
        reportsArray.push(report)
        }
        }
      
      )

    res.json({reports:reportsArray,message:"success"})
        }).catch(error=>{
          res.json({message:error})
          })
          
  console.log("Request Maden")
})



app.post("/adminpage", (req, res) => {
  if(req.body.token){
    console.log(req.body.token)
    if(TokenGenerator.isValid(req.body.token)){
      Token.find({token:req.body.token}).then((docs,err)=>{
        if(docs.length>0){
          Report.find({approved:false}).then((docs,errr)=>{
            if(errr){
              console.log("error",errr);
              res.json({message:"failed"})
              }
              else{
                res.json({reports:docs,message:"success"})
                }
          })
          }else if(err){
            console.log("error",err);
            res.json({message:"failed"})
          }
      })
    }
  }else{
  console.log("cookies ",req.cookies)
  console.log("YEAH");
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((docs, err) => {
    if (err) {
      console.log(err);
      res.json({ message: "failed" });
    } else if (docs) {
      bcrypt
        .compare(req.body.password, docs.password)
        .then((response, err) => {
          if (response) {
            console.log("Admin Girişi Başarılı");
            Report.find({approved:false}).then((docs,errr)=>{
              if(errr){
                console.log("error",errr);
                res.json({message:"failed"})
                }
                else{
                  var token= TokenGenerator.generate()
                  var newtoken=new Token({
                    token:token,
                  })
                  newtoken.save().then(d=>{if(d){
                    res.json({reports:docs,message:"success",token:token})
                  }})
                  }
            })
          } else {
            res.json({ message: "failed" });
          }
        })
        .catch((e) => {
          res.json({ message: e });
        });
    } else {
      console.log("no docs");
      res.json({ message: "failed" });
    }
  });
}
});

app.post("/approve",(req,res)=>{
  Token.find({token:req.body.token}).then((doc,err)=>{
    if(doc){
      Report.findOneAndUpdate({_id:req.body.ruid},{approved:true}).then(
        (doc,err)=>{
          User.findOneAndUpdate({_id:doc.userid},{$inc:{points:10,phototaken:1}}).then(()=>{
            res.json({message:"success",report:doc})
          })
        }
      )
    }else{
      res.json({message:"failed"})
    }
  })
})

app.post("/getscorelist",(req,res)=>{
  // find the user req.body.password & email matches
  var userpoints;
  var user_name;
  User.findOne({email:req.body.email},{username:1,points:1,password:1}).then((doc,er)=>{
    if(doc){
      if(bcrypt.compareSync(req.body.password,doc.password)){
      console.log("yes")
      userpoints=doc.points
      user_name=doc.username
      User.find({},{username:1,points:1,userpp:1}).sort({points:-1}).limit(10).then((docs,err)=>{
        if(err){
          console.log(err);
          res.json({message:"failed"})
          }
          else{
            console.log(docs)
            res.json({message:"success",users:docs,username:user_name,userpoints:userpoints})
            }
            })
            .catch((e) => {
                res.json({ message: e });
              });
            }
    }else if(err){
      console.log(err);
    }else{
      console.log("no docs");
    }
  })
})

app.post("/UserData",(req,res)=>{
  console.log("called")
  User.findOne({email:req.body.email},{password:1,phototaken:1,peoplehelped:1,daystreak:1}).then((doc,err)=>{
    if(doc){
      bcrypt.compare(req.body.password,doc.password).then(
        (result,error)=>{
          if(result){
            userdata={
              phototaken:doc.phototaken,
              peoplehelped:doc.peoplehelped,
              daystreak:doc.daystreak
            }
            console.log("success")
            res.json({message:"success",userdata:userdata})
            }
            else{
              console.log("failed")
              res.json({message:"failed"})
              }
        }
      )
      }else{
        console.log("failed no user found")
        res.json({message:"failed"})
        }
        })
})


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

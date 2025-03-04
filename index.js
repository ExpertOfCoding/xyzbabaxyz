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
const RDelete = require("./reportdelete")
const cors=require("cors");
let requested_ip = []
let requested_email = []
const context = "" // privacy policy
let scorelist_limit = 15;
const Delete_Request = require("./delete_request")
const ObjectId = mongoose.Types.ObjectId;
const goldenleauge = 100;
const ultimateleauge = 400;
const TokenGenerator = require( 'token-generator' )({
  salt: 'kaanturgunadamdir',
  timestampMap: '1234567890', // 10 chars array for obfuscation proposes
});
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const KILOMETERS_FOR_ENGELLI = ENGEL_DEBUG ? 0.2 : 0.02   ///////////////////////////////////// IMPORTANT
const cookieParser = require('cookie-parser');
const Token = require("./tokenschema");
const { request } = require("http");
app.use(cookieParser());
app.use(cors(corsOptions)) // Use this after the variable declaration

const client = new ImgurClient({
  clientId:"787f04e0731da9d",
  clientSecret: "b275518723e8233079d0528787351dcb1dba0373",
  refreshToken: "9afce0001ef9872e1700c02eeca28a9e467886c6",
})

app.set('trust proxy', true)
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload())



mongoose.connect('mongodb+srv://barisozcan105:y4062001TARIK@cluster0.vysrn.mongodb.net/test')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("<h1>OKEY</h1>")
});

app.get("/kaynakca",(req,res)=>{
  res.send(`<!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kaynakça</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 20px; padding: 20px; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { text-align: center; color: #333; }
            ol { padding-left: 20px; }
            li { margin-bottom: 10px; line-height: 1.5; }
            a { color: #007BFF; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Kaynakça</h2>
            <ol>
                <li>Arslan, Y., Şahin, H. M., Gülnar, U., Şahbudak, M. (2014). Görme Engellilerin Toplumsal Hayatta Yaşadıkları Zorluklar (Batman Merkez Örneği). Batman Üniversitesi Yaşam Bilimleri Dergisi, 4(2), 1-14.</li>
                <li>Bozkurt, A., & Genç-Kumtepe, E. (2014). Oyunlaştırma, oyun felsefesi ve eğitim: Gamification. Akademik Bilişim, 14, 147-156.</li>
                <li>C. K. Lakde and P. S. Prasad, "Navigation system for visually impaired people," 2015 International Conference on Computation of Power, Energy, Information and Communication (ICCPEIC), Melmaruvathur, India, 2015, pp. 0093-0098, <a href="https://doi.org/10.1109/ICCPEIC.2015.7259447">doi: 10.1109/ICCPEIC.2015.7259447</a>.</li>
                <li>Çakır, M., Çelik, A., Özyalçın, İ., & Uzun, A. Engelli İnsanlar İçin Akıllı Baston ve Akıllı Şapka Tasarımı.</li>
                <li>Erin Brady, Meredith Ringel Morris, Yu Zhong, Samuel White, and Jeffrey P. Bigham. 2013. Visual challenges in the everyday lives of blind people. <a href="https://doi.org/10.1145/2470654.2481291">CHI '13 Proceedings</a>.</li>
                <li>Gürkan, K., & Akan, A., (2012). Görme Engelliler İçin Engel Algılayıcı Şapka . Tıp Teknolojileri Ulusal Kongresi (pp.1-2). Antalya, Türkiye.</li>
                <li>Hugo Nicolau, Joaquim Jorge, and Tiago Guerreiro. 2009. Blobby: how to guide a blind person. <a href="https://doi.org/10.1145/1520340.1520541">CHI EA '09 Proceedings</a>.</li>
                <li>Özteke Kozan, H. İ., Bozgeyikli, H., & Kesici, Ş. (2018). Engelsiz Kent: Görme Engelli Bireylerin Kentlerde Yaşadıkları Problemler. İdealkent, 9(23), 216-235. <a href="https://doi.org/10.31198/idealkent.416798">doi: 10.31198/idealkent.416798</a>.</li>
                <li>Powell, P., Pätzold, F., Rouygari, M., Furtak, M., Kärcher, S. M., & König, P. (2024). Helping Blind People Grasp: Evaluating a Tactile Bracelet for Remotely Guiding Grasping Movements. Sensors, 24(9), 2949. <a href="https://doi.org/10.3390/s24092949">doi: 10.3390/s24092949</a>.</li>
                <li>Sezgin, S., Bozkurt, A., Yılmaz, E. A., & Van Der Linden, N. (2018). Oyunlaştırma, eğitim ve kuramsal yaklaşımlar: Öğrenme süreçlerinde motivasyon, adanmışlık ve sürdürebilirlik. Mehmet Akif Ersoy Üniversitesi Eğitim Fakültesi Dergisi, (45), 169-189.</li>
                <li>Yalar, T., & Yelken, T. Y. (2011). Değerler Eğitiminin İyileştirilmesi İle İlgili Öğretmen Görüşlerinin Belirlenmesi Ve Bir Program Modülü Örneğinin Geliştirilmesi. Elektronik Sosyal Bilimler Dergisi, 10(38), 79-98.</li>
                <li>Yazıcı, M. (2016). Değerler Ve Toplumsal Yapıda Sosyal Değerlerin Yeri. Firat University Journal of Social Sciences, 24(1), 209-223. <a href="https://doi.org/10.18069/fusbed.10221">doi: 10.18069/fusbed.10221</a>.</li>
                <li>Yıldırım, S. G., & Demirel, M. (2019). Türk Tarihinde Değerler ve Değerler Eğitimi Üzerine Bir İnceleme. Journal of Education, Theory and Practical Research, 5(1), 92-99.</li>
            </ol>
        </div>
    </body>
    </html>`);
})

app.post("/signup", (req, res) => {
  var ip = req.headers['x-forwarded-for'] ||
  req.socket.remoteAddress ||
  null;
  console.log(ip, ip.length)
  if(!requested_ip.includes(ip)){
    requested_ip.push(ip)
    if(!requested_email.includes(req.body.email)){
      requested_email.push(req.body.email)
  if (EmailValidator.validate(req.body.email)) {
    User.findOne({ email: req.body.email }).then((docs, err) => {
      if (docs) {
        res.json({ message: "email already exists" });
        requested_email.splice(requested_email.indexOf(req.body.email),1)
        requested_ip.splice(requested_ip.indexOf(ip),1)
      }
      else if (err) {
        console.log("upsideerr")
        res.json({ message: err });
        requested_email.splice(requested_email.indexOf(req.body.email),1)
        requested_ip.splice(requested_ip.indexOf(ip),1)
      } else {
        User.findOne({ username: req.body.username }).then((docs, err) => {
          if (docs) {
            res.json({ message: "username already exists" });
            requested_email.splice(requested_email.indexOf(req.body.email),1)
            requested_ip.splice(requested_ip.indexOf(ip),1)
          }
          else if (err) {
            console.log("err")
            res.json({ message: err });
            requested_email.splice(requested_email.indexOf(req.body.email),1)
            requested_ip.splice(requested_ip.indexOf(ip),1)
          } else {
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
                userpp:"https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp",
                league:"bronze"
              });
              requested_email.splice(requested_email.indexOf(req.body.email),1)
              requested_ip.splice(requested_ip.indexOf(ip),1)
              new_user.save().then((r) =>{
                  res.status(200).json({ message: "user created successfully", user: r  })
                } );
          }
        }).catch(e=>{
            res.json({message:e})
            requested_email.splice(requested_email.indexOf(req.body.email),1)
            requested_ip.splice(requested_ip.indexOf(ip),1)
        });
      }
    });
  }else{
    res.json({message:"invalid email"})
    requested_email.splice(requested_email.indexOf(req.body.email),1)
    requested_ip.splice(requested_ip.indexOf(ip),1)
  }}else{
    res.json({message:"the email have already requested"})
    requested_email.splice(requested_email.indexOf(req.body.email),1)
    requested_ip.splice(requested_ip.indexOf(ip),1)
  }
}else{
  res.json({message:"you have already requested"})
  requested_email.splice(requested_email.indexOf(req.body.email),1)
  requested_ip.splice(requested_ip.indexOf(ip),1)
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
      client.upload({image:req.body.image,title:photoname,type:"base64"}).then((urlObject)=>{"3"
        if(urlObject.data.link){
          console.log(urlObject)
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
          client.upload({image:req.body.file,type:"base64",title:photoname}).then((urlObject)=>{
            if(urlObject.data.link){
              console.log(urlObject)
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
  Report.find({approved:true},{fotourl:1,classification:1,date:1,description:1,location_lat:1,location_long:1,_id:1}).then(reports=>{
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
    if(req.body.email !== "barisozcan105@gmail.com"){
      res.json({message:"failed",reason:"you are not the admin"})
    }
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

app.post("/adddeleterequest",(req,res)=>{ //rid email password
  if(req.body.email && req.body.password && req.body.email !== null && req.body.email !=="" && req.body.password != "" && req.body.password !== null){
    User.findOne({email:req.body.email}).then((docs,error)=>{
      if(error){
        res.json({message:"error"})
      }else if(docs){
        bcrypt.compare(req.body.password,docs.password).then((result,err)=>{
          if(result){
            RDelete.findOne({rid:req.body.rid}).then((rdelete,e)=>{
              if(rdelete){
                if (rdelete.users.includes(docs._id)){
                  res.json({message:"already_requested"})
                }else{
                  RDelete.findOneAndUpdate({_id:rdelete._id},{$inc:{totalusers:1},$push:{users:docs._id}}).then((ok,erorno)=>{
                    if(ok){
                      res.json({message:"added"})
                    }else{
                      res.json({message:"error_in_adding"})
                    }
                  })
                }
              }else{
                Report.findOne({_id:req.body.rid}).then((reportdoc,reporterr)=>{
                  if(reportdoc){
                    const new_rdelete = new RDelete({ 
                      totalusers:1,
                      classification:reportdoc.classification,
                      description:reportdoc.description,
                      date:reportdoc.date,
                      location_long:reportdoc.location_long,
                      location_lat:reportdoc.location_lat,
                      fotourl:reportdoc.fotourl,
                      rid:reportdoc._id,
                      users:[docs._id],
                    })
                    new_rdelete.save().then((noerror,yeserror)=>{
                      if(noerror){
                        res.json({message:"success"})
                      }else{
                        res.json({message:"failed_at_saving"})
                      }
                    })
                  }else{
                    res.json({message:"no_report"})
                  }
                })
                
              }
            })
          }else if(err){
            res.json({message:"failed"})
          }else{
            res.json({message:"failed"})
          }
        })
      }else{
        res.json({message:"failed"})
      }
    })
  }else{
    res.json({message:"failed"})
  }
})

app.post("/deletereportrequests",(req,res)=>{
  RDelete.find().limit(req.body.limit).then((doc,err)=>{
    if(doc){
      res.json({message:"success",data:doc})
    }else{
      res.json({message:"failed"})
    }if(err){
      res.json({message:"error"})
    }

  })
})

app.post("/deletereport",(req,res)=>{ //rid
  if(req.body.token && req.body.token!=="" && req.body.token !== null){
    Token.find({token:req.body.token}).then((doc,err)=>{
      if(doc){
        RDelete.findOne({_id:req.body.rid}).then((docs,err)=>{
          if(docs){
            Report.findOneAndDelete({_id: new ObjectId(docs.rid)}).then(
              (doc,err)=>{
                res.json({message:"success",report:doc})
              }
            )
          }else{
            res.json({message:"failed_findOne"})
          }
        })
      }else{
        res.json({message:"failed_Token"})
      }
    })
  }else{
    res.json({message:"failed_TokenCheck"})
  }

})
app.post("/disapprove",(req,res)=>{
  if(req.body.token && req.body.token!=="" && req.body.token !== null){
    Token.find({token:req.body.token}).then((doc,err)=>{
      if(doc){
        Report.findOneAndDelete({_id:req.body.ruid}).then(
          (doc,err)=>{
            res.json({message:"success",report:doc})
          }
        )
      }else{
        res.json({message:"failed"})
      }
    })
  }else{
    res.json({message:"failed"})
  }

})
app.post("/seeapproveds",(req,res)=>{
  if(req.body.token && req.body.token!=="" && req.body.token !== null && req.body.limit && req.body.limit !== null && req.body.limit !== ""){
    Token.find({token:req.body.token}).then((doc,err)=>{
      if(doc){
        Report.find({approved:true}).limit(req.body.limit).then(
          (doc,err)=>{
            res.json({message:"success",data:doc})
          }
        )
      }else{
        res.json({message:"failed"})
      }
    })
  }else{
    res.json({message:"failed"})
  }
  
})
app.post("/approve",(req,res)=>{
  if(req.body.token && req.body.token!=="" && req.body.token !== null){
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
  }else{
    res.json({message:"failed"})
  }
  
})

app.post("/changescorlist",(req,res)=>{
  if(req.body.token && req.body.token!=="" && req.body.token !== null){
    try{
      Token.find({token:req.body.token}).then((doc,err)=>{
        if(doc){
          if(req.body.limit){
            scorelist_limit = req.body.limit;
            res.json({message:"success"})
          }else{
            res.json({message:"failed"})
          }
        }else{
          res.json({message:"failed"})
        }})
    }catch{
      res.json({message:"failed"})
    }
  
  }else{
    res.json({message:"failed"})
  }
  

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
      User.find({},{username:1,points:1,userpp:1,_id:0,league:1}).sort({points:-1}).limit(scorelist_limit).then((docs,err)=>{
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
  User.findOne({email:req.body.email},{password:1,phototaken:1,peoplehelped:1,daystreak:1,points:1}).then((doc,err)=>{
    if(doc){
      bcrypt.compare(req.body.password,doc.password).then(
        (result,error)=>{
          if(result){
            console.log("success")
            let updateleauge = "";
            if(doc.points >= goldenleauge && doc.points < ultimateleauge){
              updateleauge="golden" 
              userdata={
                phototaken:doc.phototaken,
                peoplehelped:doc.peoplehelped,
                daystreak:doc.daystreak,
                league:"golden"
              }
            }else if(doc.points >= ultimateleauge){
              updateleauge="ultimate"
              userdata={
                phototaken:doc.phototaken,
                peoplehelped:doc.peoplehelped,
                daystreak:doc.daystreak,
                league:"ultimate"
              }
            }else{
              updateleauge="bronze"
              userdata={
                phototaken:doc.phototaken,
                peoplehelped:doc.peoplehelped,
                daystreak:doc.daystreak,
                league:"bronze"
              }
            }
            User.findByIdAndUpdate(doc._id,{league:updateleauge}).then((ok,oker)=>{
              if(ok){
                res.json({message:"success",userdata:userdata})
              }else{
                res.json({message:"failed"})
              }
            })
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

app.post("/deleterequest", (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne().then(async (doc) => {
      if (doc) {
        if (bcrypt.compareSync(req.body.password, doc.password)) {
            new_token = TokenGenerator.generate()
            const new_delete_request = new Delete_Request({
              email:req.body.email,
              token:new_token
            })
            new_delete_request.save().then(r=>{
              res.json({message:"success",reason:"we_took_your_request"})
            })
        } else {
          res.json({ message: "failed", reason: "password_does_not_match" });
        }
      } else {
        res.json({ message: "failed", reason: "user_dont_exist" });
      }
    });
  } else {
    res.json({ message: "failed" });
  }
});

app.get("/privacypolicy",(req,res)=>{
  res.send(context)
})

app.post("/getreporter",(req,res)=>{
  let reports = [];
  let infomessage = [];
  Report.find({approved:1},{location_lat:1,location_long:1,description:1,classification:1,date:1,_id:1}).then((docs,err)=>{
    if(docs){
      reports = docs
    }
  }).then(
    r=>{
      req.body.report.forEach(element => { // 15 gun once muhabbeti eklenmeli
      reports.forEach(report => {
        if(getDistanceFromLatLonInKm(report.location_lat,report.location_long,element.latitude,element.longitude)<0.02 && !infomessage.includes(report)){
          infomessage.push(report)
          console.log(getDistanceFromLatLonInKm(report.location_lat,report.location_long,element.latitude,element.longitude))
          console.log("pushed")
        }
      })
      });
      console.log(infomessage)
      res.json({message:"success",reports:infomessage})
    }
  )
})

app.post("/deletemydata",(req,res)=>{
  if(req.body.token && req.body.email){
    Delete_Request.findOne({email:req.body.email,token:req.body.token}).then(doc=>{
      if(doc){
        User.findOneAndDelete({email:req.body.email}).then(
          r=>{
            res.json({message:"success",reason:"deleted successfully"})
          }
        )
      }
      else{
        res.json({message:"failed",reason:"not correct details"})
      }
    })
  }else{
    res.json({message:"failed",reason:"you must give token and email details"})
  }
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Listening on port 3000");
});

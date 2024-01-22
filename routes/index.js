  const express = require("express");
  const passport = require("passport");
  const env = require('dotenv').config();
  const localStragy = require("passport-local");
  const uplodes = require("./multer");
  const users = require("./users");
  const Usemodel = require("./users");
  const postModel = require('./post.models')
  const router = express.Router();

  passport.use(new localStragy(Usemodel.authenticate()));

  router.post('/uplodeimg', uplodes.single('profileImage'), async (req, res) => {
    try {
      // & Assuming you have a User model with a 'profileImage' field // 

      const user = await Usemodel.findById(req.user._id).populate('bio');
      if (!user) {
        return res.status(404).json({ error: 'User not found from Databass' });
      }
      //& Save the filename to the user's profileImage field //
      if(req.file){
        user.profileImage = req.file.filename;
      }
      await user.save();

      //+ Redirect to the user's profile page or send a success response
      res.redirect('/profile');
    } 
    catch (error) {
      console.error('Error:', error);
      //+ Handle error, redirect to an error page, or send an error response
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/", function (req, res) {
    res.render("index", {footer: false});
  });

  router.get("/login", function (req, res) {
    res.render("login", { footer: false });
  });

  router.get("/feed", isLoggedin, async function (req, res) {
    const posts = await postModel.find().populate('user');
    const user = await Usemodel.findOne({username:req.session.passport.user})
    res.render("feed", { footer: true , posts , user });
  });

  router.get("/profile", isLoggedin , async function (req, res) {
    try {
      const user = await Usemodel.findOne({username:req.session.passport.user}).populate('posts')

      res.render("profile", { user , footer: true });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/search", isLoggedin , async function (req, res) {
    const user = await Usemodel.findOne({username:req.session.passport.user})
    
    res.render("search", { footer: true , user });
  });

  router.get("/edit" , isLoggedin ,async function (req, res) {
    try {
      const user = await Usemodel.findOne({username:req.session.passport.user})
    
      res.render("edit", { footer: true , user  });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
    
  });

  router.post('/upload',isLoggedin,uplodes.single('image'), async (req,res)=>{
  const user = await Usemodel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    picture:req.file.filename,
    caption:req.body.caption,
    user:user._id,
  });
  user.posts.push(post._id)
  await user.save();
  res.redirect('/feed');
  })


  router.get("/upload", isLoggedin, async function (req, res) {
    const user = await Usemodel.findOne({username:req.session.passport.user})

    res.render("upload", { footer: true ,user });
  });

  router.post("/ragister", (req, res) => {
    const UserData = new Usemodel({
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
    });
    Usemodel.register(UserData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
      });
  });

  router.post("/login",passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/",
    }),function(req,res){}
  );

  router.get('/logout',  isLoggedin ,function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

  router.get("/username/:username", isLoggedin, async function (req, res) {
    
    const rezax = new RegExp(`^${req.params.username}`,'i');
    const user = await Usemodel.find({username:rezax});
    res.json(user)

  });

  router.get("/likes/post/:id", isLoggedin, async function (req, res) {
    try {
      const user = await Usemodel.findOne({username:req.session.passport.user});
      const post = await postModel.findOne({_id:req.params.id})
    
      if (post.likes.indexOf(user._id) === -1) {
        post.likes.push(user._id);  // Corrected from post.like.push(user._id)
      } else {
        post.likes.splice(post.likes.indexOf(user._id), 1);
      }
    
      await post.save();
      res.redirect('/feed');
      
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });


  function isLoggedin(req,res,next){
     if(req.isAuthenticated()){
      return next()
     }

    res.redirect('/')
  }


  // & This is a admin router

  router.get('/admin/user/',(req,res,next)=>{
 
    res.status(201).send("masesage:Welcame Admin")

  })

  router.post('/admin',(req,res)=>{

  })

  module.exports = router;


// Requiring the libraries
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

var app = express();

// App Config
app.use(bodyParser.urlencoded({ extended: true })); // To read form data from the body
app.use(express.static("public")); // To set express to view the public folder for custom css
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs"); // Setting ejs as the default engine
mongoose.connect("mongodb://localhost/restblog"); // Connecting to the mongoDB with DB name as restblog

// Mongoose/Model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

// Compiling the schema onto a model
var Blog = mongoose.model("blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://wallpaper-gallery.net/images/random-picture/random-picture-3.jpg",
//     body: "Hi there! Hope you're having a great day!"
// });

// RESTful ROUTES
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, obj) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {blogRet: obj});
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, obj) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, obj) {
      if(err) {
        res.redirect("/blogs");
      } else {
        res.render("show", {clickBlog: obj});
      }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, obj) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {editBlog: obj});
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, obj) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs")
    }
  })
});

app.listen(7070, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("The server is running on port 7070!");
  }
});

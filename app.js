var  express = require("express"),
methodOverride = require("method-override"),
app = express(),
bodyParser = require("body-parser"),
mongoose =  require("mongoose"),
expressSanitizer = require("express-sanitizer");



// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
mongoose.Promise = global.Promise; 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new  mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : {type: Date , default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://d1wn0q81ehzw6k.cloudfront.net/additional/thul/media/7fbd0b08750fa69f?w=890&h=590&crop=1",
//   body : "Hello  This a Blog Post"
// });
app.get("/", function(req, res) {
    res.redirect("/blogs");
})

// RESTFUL ROUTES 

// INDEX ROOUTES
app.get("/blogs", function(req ,res){
   Blog.find("/blogs", function(err, blogs){
       if(err){
           console.log(err);
       }else {
          res.render("index", {blogs : blogs});
       }
   });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
})

//CREATE ROUTE
 app.post("/blogs", function(req, res){
    //create blog and redirect'
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newblog){
        if(err){
            res.render("new");
        }else{
            //then redirect to the index
            res.redirect("/blogs");
        }
    });
 });

//Show Route
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.render("show", {blog: foundBlog});
      }
   });
});


//EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
               res.render("edit", {blog : foundBlog});
        }
    })
});

//UPDATE REQUEST

app.put("/blogs/:id", function(req,res){
     req.body.blog.body = req.sanitize(req.body.blog.body)
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect(("/blogs/" + req.params.id));
      }
   });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destory blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    })
    //redirect Somewhere
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server  is working");
});
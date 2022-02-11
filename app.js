const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser : true});
const articleSchema = {
  name : String ,
  content :String
}
const Article = mongoose.model("Article" , articleSchema);

//we can use app.route method to get poest and delete article connected with same route
//we will use app.route().get().post().delete()
/////////////////////////////////REQUEST TARGETING ALL ARTICLES*************
app.route("/articles")
.get(function(req , res){
  Article.find({} , function(err , foundArticles){
    if(!err){
      // console.log(foundArticles);
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req , res){
  // console.log(req.body.title);
  // console.log(req.body.content);

  const newArticle = new Article ({
    name : req.body.name,
    content: req.body.content
  });
  //read documation tha how i can write funnction inside save
  newArticle.save(function(err){
    if(!err){
      res.send("succesfully got your post without err")
    }else {
      res.send(err);
    }
  });

})
.delete( function(req , res){
  Article.deleteMany({} , function(err){
    if(!err){
      res.send("succesfully deleted all articles");
    }else {
      res.send(err);
    }
  });
});
/////////WE WILL USE %20 FOR WRITING SPACE IN URL


// app.get("/articles" ,);
// app.post("/articles" ,);
// app.delete("/articles" ,);

///////////////////////////////////////////REQUEST TARGTING  A SPECIFIC single ARTICLE *****************
app.route("/articles/:articleTitle")
.get(function(req , res){
Article.findOne({name : req.params.articleTitle}, function(err , foundArticle){
  if(foundArticle){
    res.send(foundArticle);
  }else {
    console.log("no article with that title has been found")
  }
});
})
.put(function(req , res){
  Article.update(
  {name :req.params.articleTitle},
    {name :req.body.name , content: req.body.content },
     // {overwrite : true},

  function(err){
    if(!err){
    res.send("succesfully updated the article which you want");
    }else {
      res.send("error has beenfound in updation");
    }
  });

})
.patch(function(req,res){
  Article.update(
    {name : req.params.articleTitle },
    {$set : req.body},
    /////THE DIFFERENCE B/W PUT AND PATCH IS THAT IN PUT ALL THE THINGS WILL  BE updated
    //BUT IN PATCH WE CAN UPDATE EITHER NAME OR CONTENT OR BOTH BUT
    //SO WE WILL USE PUT IF WE WANT TO UPDATE ALL NAME AND CONTENT OTHERWISE WE WILL USE PATCH
function(err){
  if(!err){
    res.send("succesfully updated the patch resquest");
  }else {
    res.send("err has been occered in patch");
  }
});

})
.delete(function(req ,res){
  Article.deleteOne(
    {name : req.params.articleTitle},
    function(err){
      if(!err){
        res.send("succesfully deleted your article");
      }else {
        res.send("err in deleting your articles");
      }
    }
  );
});

app.listen(3000 , function(){
  console.log("server has started on port 3000");
});

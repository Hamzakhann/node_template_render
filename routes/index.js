var express = require('express');
var router = express.Router();

const config = require("../config");
const chalk = require("chalk");
const sqlite3 = require("sqlite3").verbose()


const db = new sqlite3.Database(config.databaseName)

/* GET home page. */
router.get('/', function(req, res, next) {
  const success = req.query.submitted
  res.render('index', { title: 'Simple Express Blog', success:success });
});

router.post('/add-post', function(req, res, next) {
  const {title , author , content} = req.body;
  const date = new Date().toISOString();
  const stmt = `INSERT INTO ${config.tableName} (title , author , post , date)
  VALUES ("${title}" , "${author}" , "${content}" , "${date}")`;
  db.serialize(()=>{
    db.run(stmt);
    res.redirect('/?submitted=true')
    console.log(chalk.green("new Post added to the database"))
  })

});


router.get('/view-posts' , (req, res, next)=>{
  const stmt = `SELECT title , author , post , date FROM ${config.tableName}`;
  db.serialize(()=>{
    db.all(stmt ,(err , rows)=>{
      if(err){
        console.log(chalk.red("problem reading rows data"))
      }else{
        res.render("view-posts" , {posts:rows})
      }
    })
  })
})


router.get('/posts/:id' , (req,res,next)=>{
  const id  = req.params.id;
  const stmt = `SELECT title , author , post , date FROM ${config.tableName}
  WHERE id = ${id}`;
  db.serialize(()=>{
    db.each(stmt,(err, row)=>{
      if(err){
        console.log(chalk.red("Problem reading row"))
      }else{
        res.render('view-posts',{posts:[row]})
      }
    })

  })
})

module.exports = router;

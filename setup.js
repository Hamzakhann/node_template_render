const config = require("./config")
const chalk = require("chalk")
const sqlite3 = require("sqlite3")

const db = new sqlite3.Database(config.databaseName)


db.serialize(()=>{
    const stmt = `CREATE TABLE ${config.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, author TEXT , post TEXT , date TEXT )`;
        db.run(stmt , (err)=>{
            if(err){
                console.log(chalk.red('error creating database ' ,err))
            }else{
                console.log(chalk.green('database created OK'))
            }
        })
})

    const express = require("express");
    const bodyParser = require("body-parser");
    const fs = require("fs");
    const app = express();
    const jsonParser = bodyParser.json();
    const mysql = require("mysql2");
  
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "sclad",
      password: "ss32281488"
    });
module.exports =  {
createServer:function(port) {
    connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
     });
    
    app.use(express.static(__dirname + "/public"));
    app.get("/api/getTables", function(req,res){
      connection.query("SELECT DATABASE()",function(err, results){
        if(err){
          console.log(err)
        }
        console.log(results)
      });
      connection.query("SHOW TABLES",
      function(err, results) {
        if(err){
          console.log(err)
        }       
        res.send(results)
    });

    });
    app.get("/api/getTable/:table", function(req, res){
      let table = req.params.table
      connection.query("SELECT * FROM "+"`"+table+"`",
      function(err, results) {
        if(err){
          console.log(err)
        }       
        res.send(results)
    });
    
    });
    app.listen(port, function(){
        console.log("Сервер ожидает подключения...");
        });


    },
  closeConnection:function() {
        connection.end(function(err) {
            if (err) {
              return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
          });        
  },
  test:function() {
    console.log('test')
  }
}

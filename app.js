var   fs = require("fs"),
    	express = require("express");

app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

app.get('/api/engines', function(req, res) {
  res.send({  "title" : "Google", "keyword" : "g",
                "string" : "https://www.google.com/#q=#{query}&safe=off" });
});
app.listen(3000);
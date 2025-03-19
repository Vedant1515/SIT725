var express = require("express")
var app = express()
var port = process.env.port || 3000;
app.listen(port,()=>{
console.log("App listening to: "+port)
})
var express = require("express");
const path = require('path'); // Make sure to include this
var app = express();
var port = process.env.port || 3003;
 
app.use(express.static(path.join(__dirname, 'public')));
 
app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.send("Error: Please provide valid numbers using query parameters 'a' and 'b'.");
  }
  
  const sum = a + b;
  res.send(`The sum of ${a} and ${b} is: ${sum}`);
});
 
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
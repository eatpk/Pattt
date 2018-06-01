const express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    Blockchain=require("./blockchain");

const{getBlockchain, createNewBlock} = Blockchain;

const PORT =3000;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));//show infos from console


app.get("/blocks", (req, res) =>{//show blocks
    res.send(getBlockchain());
});
app.post("/blocks", (req, res) => {
      console.log(res);
    });


app.listen(PORT ,()  => console.log(`Server Running on ${PORT}`));
//app.post("/blocks",s);

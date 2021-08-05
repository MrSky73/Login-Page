const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { url } = require('inspector');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , (req , res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/" , (req , res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const URL = "https://us6.api.mailchimp.com/3.0/lists/b43dfa4359";
    const options = {
        method: "POST",
        auth: "aakash:8e07672c3f387003d2f0f6d342a1d194-us6"

    }
    const request = https.request(URL , options , response => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data" , data => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure" , (req , res) => {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000 , ()=> {
    console.log("Server 3000 pe hai");
})

//API KEY: 8e07672c3f387003d2f0f6d342a1d194-us6
//audience id:b43dfa4359
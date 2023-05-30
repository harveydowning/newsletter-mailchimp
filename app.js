const bodyParser = require("body-parser");

const express = require("express");

const request = require("request");

const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");

});

app.post("/", function (req, res) {
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/5c97585672"

    const options = {
        method: "post",
        auth: "random:5983a08df4c384b0063015676a890066-us21"
    }



    const request = https.request(url, options, function(response){

        response.on("data", function(data){
            var responseData = JSON.parse(data)
            console.log(JSON.parse(data))
            var errorData = Number(responseData["error_count"])

            if (errorData === 0 ) {
                res.sendFile(__dirname + "/views/success.html");
            } 
            
            else {
                res.sendFile(__dirname + "/views/failure.html");
            }

            
        })

        

        
    })

    

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/")
})

//api key: 5983a08df4c384b0063015676a890066-us21

// unique ID - 5c97585672
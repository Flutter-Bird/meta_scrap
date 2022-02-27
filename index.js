

require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');

const app = express();

usersData = [];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded

app.post('/register', (req, res) => {

    const {name, email, password, phone_number} = req.body;

    let isUserAlreadyExist = false;

    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].email === email) {
            isUserAlreadyExist = true;
            break;
        }
    }

    if (isUserAlreadyExist) {
        res.send({
            state: "FAILURE",
            data: {
                exceptions: {
                    user_already_exist: true
                }
            }
        })
        return;
    }

    let entry = {
        "name": name,
        "phone_number": phone_number,
        "email": email,
        "password": password,
        "token": uuidv4(),
        "wallet": 0
    }

    usersData.push(entry);

    res.send({
        state: "OK",
        data: {
            user: entry,

        }
    })
});


app.post("/", (req, res) => {

    res.send({data : usersData.length});
});

app.post("/login", (req, res) => {


    const email = req.body.email;
    const password = req.body.password;

    let isUserFound = false;
    let isPasswordMatched = false;

    for (let i = 0; i < usersData.length; i++) {

        if (usersData[i].email === email) {

            isUserFound = true;

            if (usersData[i].password === password) {
                isPasswordMatched = true;

                res.send({
                    state: "ok",
                    user_data: {
                        name: usersData[i].name,
                        email: usersData[i].email,
                        password: usersData[i].password,
                        token: usersData[i].token,
                        wallet: usersData[i].wallet
                    }

                })
            }

            break;
        }
    }

    if (!isUserFound) {

        res.send({

            state: "FAILURE",
            data: {
                "user_does_not_exist": "true"
            }
        })
        return;
    }

    if (!isPasswordMatched) {

        res.send({
            state: "FAILURE",
            data: {
                "wrong_password": "true"
            }
        })


    }

});


app.post("/deposit", (req, res) => {

    const {email, password, wallet} = req.body;


    let is_UserFound = false;
    let is_PasswordMatched = false;

    for (let i = 0; i < usersData.length; i++) {

        if (usersData[i].email === email) {
            is_UserFound = true;

            if (usersData[i].password === password) {
                is_PasswordMatched = true;
                usersData[i].wallet = parseInt(usersData[i].wallet) + parseInt(wallet);

                res.send({
                    state: "ok",
                    user_data: {
                        name: usersData[i].name,
                        email: usersData[i].email,
                        password: usersData[i].password,
                        token: usersData[i].token,
                        wallet: usersData[i].wallet
                    }

                })
            }

            break;
        }
    }
    if (!is_UserFound) {

        res.send({

            state: "FAILURE",
            data: {
                "user_does_not_exist": "true"
            }
        })
        return;
    }

    if (!is_PasswordMatched) {

        res.send({
            state: "FAILURE",
            data: {
                "wrong_password": "true"
            }
        })


    }


});

app.post("/withdraw", (req, res) => {

    const {email, password, wallet} = req.body;

    let is_UserFound = false;
    let is_PasswordMatched = false;
    let is_walletHasAmount = false;

    for (let i = 0; i < usersData.length; i++) {

        if (usersData[i].email === email) {
            is_UserFound = true;

            if (usersData[i].password === password) {
                is_PasswordMatched = true;

                if (!usersData[i].wallet < 0) {
                    is_walletHasAmount = true;
                    usersData[i].wallet = parseInt(usersData[i].wallet) - parseInt(wallet);

                    res.send({
                        state: "ok",
                        user_data: {
                            name: usersData[i].name,
                            email: usersData[i].email,
                            password: usersData[i].password,
                            token: usersData[i].token,
                            wallet: usersData[i].wallet
                        }

                    })
                }

                break;
            }
        }
    }
    if (!is_UserFound) {

        res.send({

            state: "FAILURE",
            data: {
                "user_does_not_exist": "true"
            }
        })
        return;
    }

    if (!is_PasswordMatched) {

        res.send({
            state: "FAILURE",
            data: {
                "wrong_password": "true"
            }
        })
    }

    if (!is_walletHasAmount) {
        res.send({
            state: "FAILURE",
            data: {
                "your_wallet_is_empty": "true"
            }
        })

    }

});

app.post("/login_with_phone_number", (req, res) => {

    const phone_no = req.body.phone_number;
    let isPhoneNumberExist = false;

    for (let i = 0; i < usersData.length; i++) {

        if (usersData[i].phone_number === phone_no) {
            isPhoneNumberExist = true;

            res.send({
                state: "OK",
                user_data: {
                    name: usersData[i].name,
                    email: usersData[i].email,
                    phone_number: usersData[i].phone_number,
                    password: usersData[i].password,
                    token: usersData[i].token,
                    wallet: usersData[i].wallet
                }

            })
            break;
        }

        if (!isPhoneNumberExist) {
            res.send({
                state: "FAILURE",
                "the_number_you_have_entered_is_not_correct": "ture"
            })
        }
    }
});

app.listen(8080, function () {
    console.log("Server is running on port 8080");
});






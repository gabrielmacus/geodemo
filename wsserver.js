/**
 * Created by Gabriel on 15/02/2018.
 */


require('app-root-dir').set(__dirname);
var path = require('path');
Service = require("./services/Service");

Service.LoadConfig();

//require our websocket library
var WebSocketServer = require('ws').Server;

//creating a websocket server at port 9090
var wss = new WebSocketServer({port: 9090});

//all connected to the server users
var clients = {};

//when a user connects to our sever
wss.on('connection', function(connection) {

    //when server gets a message from a connected user
    connection.on('message', function(message) {

        var data;
        //accepting only JSON messages
        try {
            data = JSON.parse(message);
        } catch (e) {
            data = {type:false};
        }

    });

    //when user exits, for example closes a browser window
    //this may help if we are still in "offer","answer" or "candidate" state
    connection.on("close", function() {


    });


});

function sendTo(connection, message) {
    connection.send(JSON.stringify(message));
}

//Express middleware

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const request=require('request');

app.use(cookieParser());

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    Service.CheckAuth(req,function (authenticated) {

        if(!authenticated)
        {
            //Not authenticated
          return  res.redirect("/login");
        }

        return res.render("index",{pageTitle:global.env.appName,env:global.env});


    })

    });

app.get('/login', function (req, res) {

    Service.CheckAuth(req,function (authenticated) {

        if(authenticated)
        {
            //Already authenticated
          return  res.redirect("/");
        }



        if(req.query.error)
        {
            return res.redirect("/login?facebook_error=true");
        }

        if(req.query.code)
        {
            return request.get("https://graph.facebook.com/"+global.env.facebook.version+"/oauth/access_token?client_id="+global.env.facebook.appId+"&redirect_uri="+global.env.facebook.redirectUri+"&client_secret="+global.env.facebook.appSecret+"&code="+req.query.code,function (err,response,body) {

                res.cookie('fb_token',body.access_token,{httpOnly:false,maxAge: 900000});

                return res.redirect("/");
            });


        }



       return res.render("login",{pageTitle:global.env.appName,env:global.env});

    });





});






app.listen(80);
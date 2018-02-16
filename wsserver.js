/**
 * Created by Gabriel on 15/02/2018.
 */


require('app-root-dir').set(__dirname);
const path = require('path');
Service = require("./services/Service");
Service.LoadConfig();



const session = require('express-session');
const express = require('express');
const http = require('http');
const uuidv4= require('uuid/v4');
const WebSocket = require('ws');
const app = express();
const sessionParser = session({

    resave:false,
    saveUninitialized:false,
    secret: global.env.sessionSecret
});
app.use(sessionParser);
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const querystring = require('querystring');
const request=require('request');

app.use(
    function (req,res,next) {

        req.session.sid  = uuidv4();
        next();
    }
);

app.get('/login', function (req, res) {


    Service.CheckAuth(req,res,function (authenticated) {

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

                body = JSON.parse(body);

                if(!err && !body.error)
                {

                    var cookieOpt ={httpOnly:false,maxAge: parseInt(body.expires_in)};
                    res.cookie('fb_token',body.access_token,cookieOpt);


                    req.session.userId  = uuidv4();

                }


                return res.redirect("/");
            });


        }



        return res.render("login",{pageTitle:global.env.appName,env:global.env});

    });





});




app.get('/', function (req, res) {


    Service.CheckAuth(req,res,function (authenticated) {

        if(!authenticated)
        {
            //Not authenticated
            return  res.redirect("/login");
        }

        return res.render("index",{pageTitle:global.env.appName,env:global.env});


    })

});







// set the view engine to ejs
app.set('view engine', 'ejs');



//creating a websocket server at port 9090

const server = http.createServer(app);

const wss = new WebSocket.Server({
    verifyClient:function (info,done) {


        sessionParser(info.req, {},function () {

            done(true);

    });

    },
    port: 9090},server);

//all connected to the server users
const WsService = require('./services/WsService');

const cookie = require('cookie');

//when a user connects to our sever
wss.on('connection', function(connection,req) {



    var data = {cookies:cookie.parse(req.headers.cookie)};



    Service.CheckAuth(data,false,function (authenticated) {
        if(!authenticated)
        {
            return connection.close();
        }


        WsService.Save(data.cookies.user_id,req.session.sid,connection);

        
        //when server gets a message from a connected user
        connection.on('message', function(message) {

            var msg = {type:false};
            //accepting only JSON messages
            try {
                msg = JSON.parse(message);
            } catch (e) {

            }

            switch (msg.type)
            {

            }

        });
        connection.on("error", function(e) {


        });
        //when user exits, for example closes a browser window
        //this may help if we are still in "offer","answer" or "candidate" state
        connection.on("close", function(e) {

            WsService.DeleteSession(data.cookies.user_id,req.session.sid);
        });
    });




});

app.server = server;

app.listen(80);


















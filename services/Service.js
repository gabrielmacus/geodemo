/**
 * Created by Gabriel on 15/02/2018.
 */
const fs = require('fs');
const pt = require('path');
const request=require('request');

module.exports=
{
    LoadConfig:function () {
  
        var path = pt.join(require('app-root-dir').get(),"config.json");
        global.env = JSON.parse(fs.readFileSync(path).toString());
    },
    CheckAuth:function (req,callback) {

        if(req.cookies.fb_token)
        {
            return request.get("https://graph.facebook.com/me?access_token="+req.cookies.fb_token,function (err,res,body) {

                body = JSON.parse(body);
                if(body.error)
                {
                    callback(false);
                }
                else
                {
                    callback(true);
                }
            });
        }

        callback(false);

    }

   /* Render:function (path,template,data,res) {

        fs.readFile(path,function (err,buffer) {


            var template = Handlebars.compile(buffer.toString());


            res.send(template(data));


        });
    }*/
}
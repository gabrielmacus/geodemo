/**
 * Created by Gabriel on 16/02/2018.
 */

var clients = {};
module.exports=
{
    Save:function (id,sessionid,client,data) {

        data = (!data)?{}:data;
        if(!clients[id])
        {
            clients[id]={};
        }
        clients[id][sessionid]={connection:client,data:data};
    },
    Read:function (id) {

        var client = false;

        if(clients[id])
        {
            client = clients[id];
        }

        return client;

    },
    ReadSession:function (id,sessionid) {
        var session = false;
        if(clients[id] && clients[id][sessionid])
        {
            session = clients[id][sessionid];
        }

        return session;

    },
    Delete:function (id) {

        if(clients[id])
        {
            delete clients[id];
        }

    },
    DeleteSession:function (id,sessionid) {


        if(clients[id] && clients[id][sessionid])
        {
            delete clients[id][sessionid];
        }

    },
    ReadAll:function () {

        return clients;
    }
}
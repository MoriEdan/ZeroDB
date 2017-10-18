// Zeroframe
var ZeroFrame = require("./ZeroFrame.js");
var Router = require("./router.js");

var Vue = require("vue/dist/vue.min.js");
var VueZeroFrameRouter = require("./vue-zeroframe-router.js");

Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);

require('./vue_components/navbar.js');
require('./vue_components/table.js');
require('./vue_components/code.js');

var app = new Vue({
    el: "#app",
    data: {
        currentView: null,
        siteInfo: null,
        userInfo: null
    },
    methods: {
        selectUser: function(callback = null) {
            page.selectUser(callback);
        },
        getUserInfo: function() {
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
                return;
            }

            var that = this;
            page.cmd('dbQuery', ['SELECT key, value FROM keyvalue LEFT JOIN json USING (json_id) WHERE directory="users/' + this.siteInfo.auth_address + '"'], (rows) => {
                var keyvalue = {};

                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    keyvalue[row.key] = row.value;
                }
                //if (!keyvalue.name || keyvalue.name == "") return;
                that.userInfo = {
                    cert_user_id: that.siteInfo.cert_user_id,
                    auth_address: that.siteInfo.auth_address,
                    keyvalue: keyvalue
                }

                that.$emit('getUserInfoDone', that.userInfo);
            });
        }
    },
    template: `
        <div>
            <component ref="view" :is="currentView" :site-info="siteInfo" :user-info="userInfo" v-on:select-user="selectUser" v-on:get-user-info="getUserInfo"></component>
        </div>
        `
});

class ZeroApp extends ZeroFrame {
    onOpenWebsocket() {
        this.cmd("siteInfo", {}, (site_info) => {
            this.site_info = site_info;
            app.siteInfo = this.site_info;
            app.getUserInfo();
        });
    }
    
    onRequest(cmd, message) {
        if (cmd == "setSiteInfo") {
            this.site_info = message.params;
            app.siteInfo = this.site_info;
            app.getUserInfo();
        }
        /*for (var i = 0; i < app.userInfo.keyvalue.length; i++) {
            console.log(app.userInfo.keyvalue[i]);
        }*/
    }
    
    selectUser(f = null) {
        this.cmd("certSelect", {accepted_domains: ["zeroid.bit", "kaffie.bit", "cryptoid.bit"]}, () => {
            //app.siteInfo = this.site_info; // TODO: IDK about this
            //app.getUserInfo();
            if (f != null && typeof f == 'function') f();
        });
        return false;
    }

    getDatabases(f) {
        page.cmd('dbQuery', ["SELECT * FROM databases LEFT JOIN json USING (json_id) WHERE directory='users/" + app.userInfo.auth_address + "'"], f);
    }

    getDatabase(dbId, f) {
        page.cmd('dbQuery', ["SELECT * FROM databases LEFT JOIN json USING (json_id) WHERE directory='users/" + app.userInfo.auth_address + "' AND database_id=" + dbId], (databases) => {
            if (f != null && typeof f == 'function') f(databases[0]);
        });
    }

    saveDatabase(dbId = null, dbName, dbFile, dbVersion, dbTablesJSONString, f = null) {
        if (!app.userInfo || !app.userInfo.cert_user_id) {
            this.cmd("wrapperNotification", ["info", "Please login first."]);
            return;
        }

        var data_inner_path = "data/users/" + app.userInfo.auth_address + "/data.json";
        var content_inner_path = "data/users/" + app.userInfo.auth_address + "/content.json";

        page.cmd('fileGet', {"inner_path": data_inner_path, "required": false}, (data) => {
            if (!data) {
                data = {
                    "next_database_id": 1,
                    "databases": []
                }
            } else {
                data = JSON.parse(data);
            }

            if (!data["databases"]) data["databases"] = [];

            if (dbId != null) {
                var found = false;
                for (var i = 0; i < data["databases"].length; i++) {
                    let database = data["databases"][i];
                    if (database.database_id == dbId) {
                        database.name = dbName;
                        database.file = dbFile;
                        database.version = dbVersion;
                        database.tables = dbTablesJSONString;
                        database.date_updated = Date.now();
                        found = true;
                    }
                }
                if (!found) {
                    this.cmd("wrapperNotification", ["error", "Database not found!"]);
                    return;
                }
            } else {
                data["databases"].push({
                    "database_id": app.userInfo.keyvalue["next_database_id"] || 1,
                    "name": dbName,
                    "file": dbFile,
                    "version": dbVersion,
                    "tables": dbTablesJSONString,
                    "date_added": Date.now()
                });

                if (!app.userInfo.keyvalue["next_database_id"] || app.userInfo["next_database_id"] == null) {
                    app.userInfo.keyvalue["next_database_id"] = 1;
                }

                app.userInfo.keyvalue["next_database_id"]++;
                data["next_database_id"] = app.userInfo.keyvalue["next_database_id"];
            }

            var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')));

            page.cmd('fileWrite', [data_inner_path, btoa(json_raw)], (res) => {
                if (res == "ok") {
                    page.cmd('siteSign', {"inner_path": content_inner_path}, (res) => {
                        if (f != null && typeof f == 'function') f();
                        page.cmd('sitePublish', {"inner_path": content_inner_path, "sign": false});
                    });
                }
            });
        });
    }
}

page = new ZeroApp();

var Home = require("./router_pages/home.js");
var MyDatabases = require("./router_pages/my_databases.js");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
    { route: 'me/databases', component: MyDatabases },
    { route: 'me/database/:id', component: Home },
    { route: '', component: Home }
]);
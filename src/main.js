// Zeroframe
var ZeroFrame = require("./ZeroFrame.js");

var Vue = require("vue/dist/vue.min.js");

require('./vue_components/navbar.js');
require('./vue_components/table.js');
require('./vue_components/code.js');

var app = new Vue({
    el: "#app",
    data: {
        //currentView: null,
        //userInfo: null,
        dbName: "",
        dbFile: "",
        dbVersion: 2,
        siteInfo: null,
        tables: [],
        showCode: false
    },
    methods: {
        addTable: function() {
            this.tables.push({
                name: "",
                columns: [],
                indexes: [
                    {
                        type: "UNIQUE",
                        name: "_key",
                        onColumns: "json_id,"
                    }
                ],
                schema_changed: 0
            });
        },
        addMapping: function() {

        }
    },
    template: `
        <div>
            <custom-nav v-on:add-table="addTable" v-on:add-mapping="addMapping" v-on:show-code="showCode = true;"></custom-nav>
            <section class="section">
                <div class="container">
                    <p style="margin-bottom: 10px;">Visual editor to create Dbschema files. Still a work in progress. <em>NOTE: The On Columns field for indexes are comma separated and the json table and json_id columns are automatically created.</em></p>
                    <div style="width: 200px; display: inline-block; margin-right: 10px; margin-bottom: 10px;">
                        <div class="box">
                            <h3 style="border-bottom: 1px solid #BBBBCC; padding-bottom: 5px; margin-bottom: 20px;">Settings</h3>
                            <input class="input" type="text" v-model="dbName" placeholder="Database Name">
                            <input class="input" type="text" v-model="dbFile" placeholder="Database File" style="margin-top: 5px;">
                            <div class="select" style="margin-top: 5px; width: 100%;">
                                <select style="width: 100%;" v-model="dbVersion">
                                    <option value="1">v1</option>
                                    <option value="2">v2</option>
                                    <option value="3">v3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <db-table v-for="table in tables" v-model="table" :tables="tables"></db-table>
                </div>
            </section>
            <db-schema-code v-if="showCode" v-model="showCode" :tables="tables" :name="dbName" :file="dbFile" :version="dbVersion"></db-schema-code>
        </div>
        `
});

class ZeroApp extends ZeroFrame {
    onOpenWebsocket() {
        this.cmd("siteInfo", {}, (site_info) => {
            this.site_info = site_info;
            app.siteInfo = this.site_info;
            //app.getUserInfo();
        });
    }
    
    onRequest(cmd, message) {
        if (cmd == "setSiteInfo") {
            this.site_info = message.params;
            //app.from = this.site_info.auth_address;
            app.siteInfo = this.site_info;
            //app.getUserInfo();
        }
        /*for (var i = 0; i < app.userInfo.keyvalue.length; i++) {
            console.log(app.userInfo.keyvalue[i]);
        }*/
    }
    
    selectUser(f = null) {
        this.cmd("certSelect", {accepted_domains: ["zeroid.bit", "kaffie.bit", "cryptoid.bit"]}, () => {
            // TODO: Will this work always?
            //app.getUserInfo();
            if (f != null && typeof f == 'function') f();
        });
        return false;
    }
}

page = new ZeroApp();
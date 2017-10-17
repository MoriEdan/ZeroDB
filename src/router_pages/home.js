var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
	props: ['siteInfo'],
	data: function() {
        return {
	        dbName: "",
	        dbFile: "",
	        dbVersion: 2,
	        tables: [
	            {
	                name: "json",
	                columns: [
	                    { name: "json_id", type: "INTEGER PRIMARY KEY AUTOINCREMENT" },
	                    { name: "directory", type: "TEXT" },
	                    { name: "file_name", type: "TEXT" },
	                    { name: "cert_user_id", type: "TEXT" }
	                ],
	                indexes: [ { type: "UNIQUE", name: "path", onColumns: "directory, file_name" } ],
	                schema_changed: 0
	            }
	        ],
	        showCode: false,
	        showJSON: false
	    }
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

	    },
	    selectUser: function(callback = null) {
	    	this.$emit('select-user', callback);
	    }
	},
	template: `
		<div>
			<custom-nav v-on:add-table="addTable" v-on:add-mapping="addMapping" v-on:show-code="showCode = true;" v-on:select-user="selectUser" :site-info="siteInfo"></custom-nav>
			<section class="section">
			    <div class="container">
			        <p style="margin-bottom: 15px;">Visual editor to create Dbschema files. Still a work in progress. <em>NOTE: The On Columns field for indexes are comma separated and the json table and json_id columns are automatically created.</em></p>
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
			        <db-table v-for="table in tables" v-model="table" :tables="tables" v-if="table.name != 'json' && !showJSON"></db-table>
			    </div>
			</section>
			<db-schema-code v-if="showCode" v-model="showCode" :tables="tables" :name="dbName" :file="dbFile" :version="dbVersion"></db-schema-code>
		</div>
		`
};

module.exports = Home;
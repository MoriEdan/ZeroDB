var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");
var moment = require('moment');

var Explore = {
	props: ['userInfo'],
	data: function() {
        return {
        	databases: []
	    }
    },
    beforeMount: function() {
    	if (!this.userInfo) {
    		this.$emit('get-user-info');
    		this.$parent.$on('getUserInfoDone', this.getDatabases);
    	} else {
    		this.getDatabases();
    	}
    },
	methods: {
		goto: function(to) {
			Router.navigate(to);
		},
		getDatabases: function() {
			var that = this;
	    	page.getAllDatabases((databases) => {
	    		that.databases = databases;
	    		console.log(databases);
	    	});
		},
	    addTable: function() {
	    },
	    addMapping: function() {

	    },
	    selectUser: function(callback = null) {
	    	this.$emit('select-user', callback);
	    },
	    dateCreated: function(date) {
	    	return moment(date).fromNow();
	    },
		getAuthAddress: function(directory) {
			return directory.replace(/users\//, '').replace(/\//g, '');
		}
	},
	template: `
		<div>
			<custom-nav v-on:add-table="addTable" v-on:add-mapping="addMapping" v-on:select-user="selectUser" :user-info="userInfo" :hide-right="true"></custom-nav>
			<section class="section">
				<div class="container">
					<a class="button is-small is-primary" v-on:click.prevent="goto('')">New Database</a>
					<div v-for="database in databases" style="margin-top: 5px;">
						<h3><a v-on:click.prevent="goto(getAuthAddress(database.directory) + '/' + database.database_id)">{{ database.name ? database.name : "[No Name]" }}</a></h3>
						<p>
							{{ database.file }} - v{{ database.version }}<br>
							<a v-on:click.prevent="goto(getAuthAddress(database.directory))">{{ database.cert_user_id }}</a> - {{ dateCreated(database.date_added) }}
						</p>
					</div>
				</div>
			</section>
		</div>
		`
};

module.exports = Explore;
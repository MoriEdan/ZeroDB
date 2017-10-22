var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");
var moment = require('moment');

var UserProfile = {
	props: ['userInfo'],
	data: function() {
        return {
        	userId: "",
        	databases: []
	    }
    },
    beforeMount: function() {
    	/*if (!this.userInfo) {
    		this.$emit('get-user-info');
    		this.$parent.$on('getUserInfoDone', this.getDatabases);
    	} else {
    		this.getDatabases();
    	}*/
    	this.getDatabases();
    },
	methods: {
		goto: function(to) {
			Router.navigate(to);
		},
		getDatabases: function() {
			var that = this;
	    	page.getUserDatabases(Router.currentParams["userauthaddress"], (databases) => {
	    		that.databases = databases;
	    		that.userId = databases[0].cert_user_id;
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
					<h1>{{ userId ? userId : "User Doesn't Exist!" }}</h1>
					<div v-for="database in databases" style="margin-top: 5px;">
						<h3><a v-on:click.prevent="goto(getAuthAddress(database.directory) + '/' + database.database_id)">{{ database.name }}</a></h3>
						<p>
							{{ database.file }} - v{{ database.version }}
							{{ dateCreated(database.date_added) }}
						</p>
					</div>
				</div>
			</section>
		</div>
		`
};

module.exports = UserProfile;
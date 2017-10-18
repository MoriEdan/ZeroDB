var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var MyDatabases = {
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
	    	page.getDatabases((databases) => {
	    		that.databases = databases;
	    	});
		},
	    addTable: function() {
	    },
	    addMapping: function() {

	    },
	    selectUser: function(callback = null) {
	    	this.$emit('select-user', callback);
	    }
	},
	template: `
		<div>
			<custom-nav v-on:add-table="addTable" v-on:add-mapping="addMapping" v-on:select-user="selectUser" :user-info="userInfo" :hide-right="true"></custom-nav>
			<section class="section">
				<div class="container">
					<a class="button is-small is-primary" v-on:click.prevent="goto('')">New Database</a>
					<div v-for="database in databases" style="margin-top: 5px;">
						<h3><a v-on:click.prevent="goto('me/database/' + database.database_id)">{{ database.name }}</a></h3>
						<p>{{ database.file }} - version {{ database.version }}</p>
					</div>
				</div>
			</section>
		</div>
		`
};

module.exports = MyDatabases;
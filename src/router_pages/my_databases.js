var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var MyDatabases = {
	props: ['siteInfo'],
	data: function() {
        return {
        	databases: []
	    }
    },
	methods: {
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
			<custom-nav v-on:add-table="addTable" v-on:add-mapping="addMapping" v-on:select-user="selectUser" :site-info="siteInfo"></custom-nav>
			<section class="section">
				<h1>Not implemented yet!</h1>
			</section>
		</div>
		`
};

module.exports = MyDatabases;
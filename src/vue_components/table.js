var Vue = require("vue/dist/vue.min.js");

Vue.component('db-table', {
	props: ['value', 'tables'],
	methods: {
		addColumn: function() {
			this.value.columns.push({
				name: "",
				type: ""
			});
		},
		addIndex: function() {
			this.value.indexes.push({
				type: "",
				name: "",
				//onTable: "",
				onColumns: "" // Will become Array of strings later
			});
		}
	},
	template: `
		<div style="display: inline-block; width: 500px; margin-right: 10px; margin-bottom: 10px;">
			<div class="box">
				<h3 style="border-bottom: 1px solid #BBBBCC; padding-bottom: 5px; margin-bottom: 10px;">
					<input type="text" v-model="value.name" placeholder="Table Name" style="font-size: inherit; border: none; display: inline; color: inherit; width: 100%;">
				</h3>
				<div v-if="value.columns.length > 0" style="margin-bottom: 10px;">
					<div>Columns: </div>
					<db-table-column v-for="column in value.columns" v-model="column"></db-table-column>
				</div>
				<div v-if="value.indexes.length > 0" style="margin-bottom: 10px;">
					<div>Indexes: </div>
					<db-table-index v-for="index in value.indexes" v-model="index" :tables="tables"></db-table-index>
				</div>
				<div>
					<a class="button is-primary is-small" href="#" v-on:click.prevent="addColumn()">Add Column</a>
					<a class="button is-primary is-small" href="#" v-on:click.prevent="addIndex()">Add Index</a>
				</div>
			</div>
		</div>
		`
});

Vue.component('db-table-column', { // TODO: How to handle referencing another column (for example, for the json_id column that is required for all tables)?
	props: ['value'],
	template: `
		<div style="border-bottom: 1px solid #BBBBCC; font-size: 1.05em;">
			<input type="text" v-model="value.name" placeholder="Column Name" style="margin-bottom: 5px; display: inline; width: 49%; font-size: inherit; color: inherit; background-color: inherit; border: none; border-right: 1px solid #BBBBCC; margin: 0;">
			<select v-model="value.type" style="display: inline; margin-bottom: 5px; width: 49%; font-size: inherit; color: inherit; background-color: inherit; border: none; margin: 0;">
				<option value="INTEGER">Integer</option>
				<option value="TEXT">Text</option>
				<option value="DATETIME">DateTime</option>
			</select>
		</div>
		`
});

Vue.component('db-table-index', {
	props: ['value', 'tables'],
	template: `
		<div style="border-bottom: 1px solid #BBBBCC; font-size: 1.05em;">
			<input type="text" v-model="value.name" placeholder="Index Name" style="margin-bottom: 5px; display: inline; width: 32%; font-size: inherit; color: inherit; background-color: inherit; border: none; border-right: 1px solid #BBBBCC; margin: 0;">
			<select v-model="value.type" style="display: inline; margin-bottom: 5px; width: 32%; font-size: inherit; color: inherit; background-color: inherit; border: none; margin: 0;">
				<option value="UNIQUE">Unique</option>
				<option value="PRIMARY">Primary</option> <!-- TODO: How to handle AutoIncrement? -->
			</select>
			<input type="text" v-model="value.onColumns" placeholder="On Columns (comma separated)" style="margin-bottom: 5px; display: inline; width: 32%; font-size: inherit; color: inherit; background-color: inherit; border: none; border-right: 1px solid #BBBBCC; margin: 0;">
		</div>
		`
});
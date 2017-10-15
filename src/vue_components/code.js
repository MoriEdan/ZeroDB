var Vue = require("vue/dist/vue.min.js");

Vue.component('db-schema-code', {
	props: ['value', 'tables', 'name', 'file', 'version'],
	data: function() {
		return {
			code: ''
		}
	},
	mounted: function() {
		var name = this.name;
		var file = this.file;
		var version = this.version;
		var tables = this.tables;

		var tableText = "";
		//for (var table of tables) {
		for (var i = 0; i < tables.length; i++) {
			let table = tables[i];
			let comma = ",";
			if (i == tables.length - 1) {
				comma = "";
			}

			let columnsText = "";
			for (var ii = 0; ii < table.columns.length; ii++) {
				let column = table.columns[ii];
				if (table.name == "json" && ii == table.columns.length - 1) {
					columnsText += `["${column.name}", "${column.type}"]`;
				} else {
					columnsText += `["${column.name}", "${column.type}"],
				`;	
				}
			}

			if (table.name != "json") {
				columnsText += `["json_id", "INTEGER REFERENCES json (json_id)"]`;
			}

			let indexesText = "";
			for (var index of table.indexes) {
				indexesText += `"CREATE ${index.type} INDEX ${index.name} ON ${table.name} (${index.onColumns})", `;
			}

			console.log(table.name);
			tableText += `        "${table.name}": {
			"cols": [
				${columnsText}
			],
			"indexes": [${indexesText}],
			"schema_changed": ${table.schema_changed}
		}${comma}
`;
		}

		this.code += `{
	"db_name": "${name}",
	"db_file": "${file}",
	"version": ${version},
	"maps": {
	}
	"tables": {
${tableText}	}
}`;
	},
	methods: {
		close: function() {
			this.$emit('input', false);
		},
		copy: function() {
			var aux = document.createElement("div");
			aux.setAttribute("contentEditable", true);
			//aux.value = this.code;
			document.body.appendChild(aux);
			aux.focus();
			document.execCommand("insertText", false,  this.code);
			document.execCommand('selectAll', false, null);
			document.execCommand("copy");
			document.body.removeChild(aux);
		}
	},
	template: `
		<div class="modal" v-bind:class="{ 'is-active': value }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                	<h2>Dbschema Code</h2>
                	<button class="delete" v-on:click.prevent="close()"></button>
               	</header>
               	<section class="modal-card-body">
               		<textarea disabled v-model="code" style="padding: 5px; width: 100%; height: 400px; margin-bottom: 5px;">
               		</textarea>
               		<a href="#" class="button is-primary is-small" v-on:click.prevent="copy()">Copy to Clipboard</a>
               	</section>
            </div>
		</div>
		`
});
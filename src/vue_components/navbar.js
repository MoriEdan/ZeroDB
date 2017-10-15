var Vue = require("vue/dist/vue.min.js");

Vue.component('custom-nav', {
    props: ['shadow'],
    data: function() {
        return {
            menuShown: false // For touch devices
        }
    },
    methods: {
        toggleMenu: function() { // For touch devices
            this.menuShown = !this.menuShown;
        },
        addTable: function() {
            this.$emit('add-table');
        },
        showCode: function() {
            this.$emit('show-code');
        }
    },
    template: `
            <nav class="navbar is-transparent has-shadow is-info" v-bind:class="{ 'has-shadow': shadow }">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="./?/" style="font-weight: bold;" v-on:click.prevent="">ZeroDB Helper</a>
                        <div class="navbar-burger burger" v-bind:class="{ 'is-active': menuShown }" style="margin-right: 70px; margin-left: auto !important;" v-on:click.prevent="toggleMenu()">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div class="navbar-menu" v-bind:class="{ 'is-active': menuShown }">
                        <div class="navbar-start is-hidden-touch">
                            <!--<a class="navbar-item" href="./?/me/newstory" v-on:click.prevent="">Write a story</a>-->
                        </div>
                        <div class="navbar-end">
                            <div class="navbar-item has-dropdown is-hoverable">
                                <a class="navbar-link">Add</a>
                                <div class="navbar-dropdown is-right">
                                    <a class="navbar-item" href="#" v-on:click.prevent="addTable()">Table</a>
                                    <a class="navbar-item">Mapping</a>
                                    
                                    <hr class="navbar-divider">

                                    <a class="navbar-item">Static JSON File</a>
                                </div>
                            </div>
                            <a class="navbar-item">Save</a>
                            <a class="navbar-item" href="#" v-on:click.prevent="showCode()">Code</a>
                        </div>
                    </div>
                </div>
            </nav>
        `
});
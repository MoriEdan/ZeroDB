var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component('custom-nav', {
    props: ['shadow', 'siteInfo'],
    data: function() {
        return {
            menuShown: false // For touch devices
        }
    },
    computed: {
        isLoggedIn: function() {
            if (!this.siteInfo || !this.siteInfo.cert_user_id) return false;
            return true;
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
        },
        goto: function(to) {
            Router.navigate(to);
        },
        login: function() {
            this.$emit('select-user');
        }
    },
    template: `
            <nav class="navbar is-transparent has-shadow is-info" v-bind:class="{ 'has-shadow': shadow }">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="./?/" style="font-weight: bold;" v-on:click.prevent="goto('')">ZeroDB</a>
                        <div class="navbar-burger burger" v-bind:class="{ 'is-active': menuShown }" style="margin-right: 70px; margin-left: auto !important;" v-on:click.prevent="toggleMenu()">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div class="navbar-menu" v-bind:class="{ 'is-active': menuShown }">
                        <div class="navbar-start is-hidden-touch">
                            <a class="navbar-item" v-on:click.prevent="login()" v-if="isLoggedIn">{{ siteInfo.cert_user_id }}</a>
                            <a class="navbar-item" v-on:click.prevent="login()" v-else>Login</a>
                            <a class="navbar-item" v-on:click.prevent="goto('me/databases')" v-if="isLoggedIn">My Databases</a>
                            <a class="navbar-item">Explore</a>
                        </div>
                        <div class="navbar-end">
                            <a class="navbar-item is-hidden-desktop" v-on:click.prevent="" v-if="isLoggedIn">{{ siteInfo.cert_user_id }}</a>
                            <a class="navbar-item is-hidden-desktop" v-on:click.prevent="login()" v-else>Login</a>
                            <a class="navbar-item is-hidden-desktop" v-on:click.prevent="goto('me/databases')" v-if="isLoggedIn">My Databases</a>
                            <a class="navbar-item is-hidden-desktop">Explore</a>
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
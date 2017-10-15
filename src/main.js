// Zeroframe
var ZeroFrame = require("./ZeroFrame.js");
var Router = require("./router.js");

var Vue = require("vue/dist/vue.min.js");
var VueZeroFrameRouter = require("./vue-zeroframe-router.js");

Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);

require('./vue_components/navbar.js');
require('./vue_components/table.js');
require('./vue_components/code.js');

var app = new Vue({
    el: "#app",
    data: {
        currentView: null,
        siteInfo: null
    },
    template: `
        <div>
            <component ref="view" v-bind:is="currentView"></component>
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

var Home = require("./router_pages/home.js");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
    { route: '', component: Home }
]);
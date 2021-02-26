(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{f318ce6ba0668e624433:function(e,a,t){"use strict";t.r(a);var n,o=t("8af190b70a6bc55c6f1b"),s=t.n(o),r=t("ab039aecd4a1d4fedc0e"),i=(Object(r.defineMessages)({header:{id:"".concat("app.components.Header",".header"),defaultMessage:"This is the Header component!"}}),t("5e98cee1846dbfd41421")),c=t("fb53a21ab7ecd0262896");function u(e){return(u="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,a,t,o){n||(n="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var s=e&&e.defaultProps,r=arguments.length-3;if(a||0===r||(a={children:void 0}),1===r)a.children=o;else if(r>1){for(var i=new Array(r),c=0;c<r;c++)i[c]=arguments[c+3];a.children=i}if(a&&s)for(var u in s)void 0===a[u]&&(a[u]=s[u]);else a||(a=s||{});return{$$typeof:n,type:e,key:void 0===t?null:""+t,ref:null,props:a,_owner:null}}function f(e,a){for(var t=0;t<a.length;t++){var n=a[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(e,a){return(d=Object.setPrototypeOf||function(e,a){return e.__proto__=a,e})(e,a)}function p(e){var a=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var t,n=m(e);if(a){var o=m(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return function(e,a){if(a&&("object"===u(a)||"function"===typeof a))return a;return v(e)}(this,t)}}function v(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}var g=l("p",{className:"logo-text"},void 0,"Le Thoos"),y=l("i",{className:"fa fa-home","aria-hidden":"true"}),b=l("i",{className:"fa fa-tags","aria-hidden":"true"}),N=l("i",{className:"fa fa-history","aria-hidden":"true"}),S=l("i",{className:"fa fa-pencil-square-o","aria-hidden":"true"}),k=l("i",{className:"fa fa-shopping-cart","aria-hidden":"true"}),w=l("i",{className:"fa fa-user","aria-hidden":"true"}),O=l("i",{className:"fa fa-power-off","aria-hidden":"true"}),P=l("p",{className:"logo-text-mob"},void 0,"Le Thoos"),C=l("p",{className:"logo-text"},void 0,"Le Thoos"),j=l("span",{className:"landing-page-mob-nav-icon"},void 0,l("i",{className:"fa fa-bars","aria-hidden":"true"})),D=function(e){!function(e,a){if("function"!==typeof a&&null!==a)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(a&&a.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),a&&d(e,a)}(u,s.a.PureComponent);var a,n,o,r=p(u);function u(){var e;!function(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}(this,u);for(var a=arguments.length,t=new Array(a),n=0;n<a;n++)t[n]=arguments[n];return h(v(e=r.call.apply(r,[this].concat(t))),"state",{customerDetails:{},sideNavStatus:!1}),h(v(e),"openCloseNav",function(){var a=e.state.sideNavStatus;e.setState({sideNavStatus:!a})}),h(v(e),"closeNav",function(){e.setState({sideNavStatus:!1})}),e}return a=u,(n=[{key:"componentWillMount",value:function(){var e=JSON.parse(sessionStorage.getItem("customerDetails"))?JSON.parse(sessionStorage.getItem("customerDetails")):this.state.customerDetails;0==Object.keys(e).length&&i.a.push("/login"),this.setState({customerDetails:e})}},{key:"render",value:function(){var e=this;return l("div",{},void 0,l("span",{className:"nav-desktop-view"},void 0,l("div",{className:"header sticky-top"},void 0,l("img",{className:"logo",src:t("054e349a68ea8f325df9")}),g,l("span",{className:"nav-items"},void 0,l("span",{className:"nav-mr",onClick:function(){return i.a.push("/landingPage")}},void 0,y," Shops"),l("span",{className:"nav-mr",onClick:function(){return i.a.push("/offersPage")}},void 0,b," Offers"),l("span",{className:"nav-mr",onClick:function(){return i.a.push("/orderHistoryPage")}},void 0,N," Order History"),l("span",{className:"nav-mr",onClick:function(){return i.a.push("/profilePage")}},void 0,S," Profile"),l("span",{className:"nav-mr",onClick:function(){return i.a.push("/checkoutPage")}},void 0,k," Cart"),l("span",{className:"nav-mr"},void 0,w," ",this.state.customerDetails.name&&Object(c.a)(this.state.customerDetails.name)),l("span",{className:"nav-mr",onClick:function(){sessionStorage.clear(),i.a.push("/login")}},void 0,O," Logout")))),l("span",{className:"nav-mob-view"},void 0,l("div",{id:"mySidenav",className:this.state.sideNavStatus?"openNav sidenav":"closeNav sidenav"},void 0,l("a",{className:"closebtn",onClick:function(){return e.closeNav()}},void 0,"\xd7"),l("div",{className:"mr-b-30"},void 0,l("img",{className:"logo-mob",src:t("054e349a68ea8f325df9")}),P),l("p",{className:"mob-nav-text"},void 0,"Hi, ",this.state.customerDetails.name&&Object(c.a)(this.state.customerDetails.name)),l("p",{className:"sidenav-heading",onClick:function(){return i.a.push("/profilePage")}},void 0,"Profile"),l("p",{className:"sidenav-heading",onClick:function(){return i.a.push("/orderHistoryPage")}},void 0,"Order History"),l("p",{className:"sidenav-heading",onClick:function(){return i.a.push("/landingPage")}},void 0,"Shops"),l("p",{className:"sidenav-heading",onClick:function(){return i.a.push("/offersPage")}},void 0,"Offers"),l("p",{className:"sidenav-heading",onClick:function(){return i.a.push("/checkoutPage")}},void 0,"Cart"),l("p",{className:"sidenav-heading",onClick:function(){sessionStorage.clear(),i.a.push("/login")}},void 0,"Logout")),l("div",{id:"main"},void 0,l("img",{className:"logo",src:t("054e349a68ea8f325df9")}),C,l("span",{onClick:function(){return e.openCloseNav()}},void 0,j))))}}])&&f(a.prototype,n),o&&f(a,o),u}();a.default=D}}]);
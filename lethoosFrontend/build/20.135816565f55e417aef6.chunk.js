(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{d847eb55a7b43932bfe0:function(e,t,a){"use strict";a.r(t);var o=a("216ee9ae289723f588c5"),r=a.n(o),n=a("8af190b70a6bc55c6f1b"),i=a.n(n),l=(a("8a2d1b95e05b6a321e74"),a("d7dd51e1bf6bfc2c9c3d")),s=a("0d7f0986bcd2f33d8a2a"),c=a("ab039aecd4a1d4fedc0e"),u=a("a28fc3c963a1d4d1a2e5"),d=a("ab4cb61bcb2dc161defb"),f=a("adc20f99e57c573c589c"),m=a("d95b0cf107403b178365"),p=a("54f683fcda7806277002"),b="app/ProfilePage/DEFAULT_ACTION",g=Object(p.fromJS)({});var v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g;switch((arguments.length>1?arguments[1]:void 0).type){case b:default:return e}},h=function(e){return e.get("profilePage",g)},y=function(){return Object(u.a)(h,function(e){return e.toJS()})},N=regeneratorRuntime.mark(S);function S(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},N)}Object(c.defineMessages)({header:{id:"".concat("app.containers.ProfilePage",".header"),defaultMessage:"This is the ProfilePage container!"}});var O,P=a("600e6bf7eefc3f53a303"),w=a("bd183afcc37eabd79225"),M=a.n(w),C=(a("fb53a21ab7ecd0262896"),a("3d0272aa0de96073dbf8"));function D(e){return(D="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(e,t,a,o){O||(O="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var r=e&&e.defaultProps,n=arguments.length-3;if(t||0===n||(t={children:void 0}),1===n)t.children=o;else if(n>1){for(var i=new Array(n),l=0;l<n;l++)i[l]=arguments[l+3];t.children=i}if(t&&r)for(var s in r)void 0===t[s]&&(t[s]=r[s]);else t||(t=r||{});return{$$typeof:O,type:e,key:void 0===a?null:""+a,ref:null,props:t,_owner:null}}function H(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function k(e,t){return(k=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var a,o=_(e);if(t){var r=_(this).constructor;a=Reflect.construct(o,arguments,r)}else a=o.apply(this,arguments);return function(e,t){if(t&&("object"===D(t)||"function"===typeof t))return t;return J(e)}(this,a)}}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _(e){return(_=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function I(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}a.d(t,"ProfilePage",function(){return Y});var A=j(s.Helmet,{},void 0,j("title",{},void 0,"ProfilePage"),j("meta",{name:"description",content:"Description of ProfilePage"})),R=j(P.a,{}),L=j("p",{className:"offers-heading"},void 0,"My Profile"),E=j("div",{className:"lds-dual-ring"}),T=j("label",{className:"box-label",htmlFor:"inputlg"},void 0,"Name"),F=j("label",{className:"box-label",htmlFor:"inputlg"},void 0,"Select Area"),q=j("option",{value:"Other20"},void 0,"Other"),U=j("option",{value:"kosi10"},void 0,"kosi"),B=j("option",{value:"jindal20"},void 0,"Jindal"),G=j("option",{value:"narsiVillage20"},void 0,"Narsi Village"),V=j("option",{value:"gopalBagh20"},void 0,"Gopal Bagh"),$=j("option",{value:"kamlaNagar20"},void 0,"Kamla Nagar"),K=j("option",{value:"bathenGate20"},void 0,"Bathen Gate"),W=j("label",{className:"box-label",htmlFor:"inputlg"},void 0,"Mobile Number"),z=j("label",{className:"box-label",htmlFor:"inputlg"},void 0,"Mobile Number for Call"),Q=j("label",{className:"box-label",htmlFor:"inputlg"},void 0,"Address"),X=j("div",{className:"text-right"},void 0,j("button",{type:"submit",className:"btn btn-warning profile-page-btn"},void 0,"Update")),Y=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&k(e,t)}(l,i.a.PureComponent);var t,a,o,n=x(l);function l(){var e;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l);for(var t=arguments.length,a=new Array(t),o=0;o<t;o++)a[o]=arguments[o];return I(J(e=n.call.apply(n,[this].concat(a))),"state",{customerDetails:{},payload:{name:"",address:"",mobileNumber:"",alternateMobileNumber:"",area:""},isLoader:!1}),I(J(e),"modalCloseHandler",function(){setTimeout(function(){e.setState({isMessageModal:!1})},1e3)}),I(J(e),"inputChangeHandler",function(t){var a=r()(e.state.payload);a[t.target.id]=t.target.value,e.setState({payload:a})}),I(J(e),"updateProfileHandler",function(t){t.preventDefault();var a=r()(e.state.payload),o=JSON.parse(sessionStorage.getItem("customerDetails"))?JSON.parse(sessionStorage.getItem("customerDetails")):e.state.customerDetails;o.name=a.name,o.address=a.address,o.mobileNumber=a.mobileNumber,o.alternateMobileNumber=a.alternateMobileNumber,o.area=a.area,sessionStorage.setItem("customerDetails",JSON.stringify(o)),e.setState({customerDetails:o,payload:o,isLoader:!0},function(){return e.updateProfileHandlerApi()})}),I(J(e),"updateProfileHandlerApi",function(){var t=JSON.parse(sessionStorage.getItem("customerDetails"))?JSON.parse(sessionStorage.getItem("customerDetails")):e.state.customerDetails,a=r()(e.state.payload),o=window.API_URL+"/customerLogin/".concat(t._id);M.a.patch(o,a).then(function(t){e.setState({isLoader:!1,message:"Profile Updated Successfully",isMessageModal:!0,type:"success"},function(){return e.modalCloseHandler()})}).catch(function(t){e.setState({isLoader:!1,message:"Some Error Occured",isMessageModal:!0,type:"failure"})})}),e}return t=l,(a=[{key:"componentWillMount",value:function(){var e=JSON.parse(sessionStorage.getItem("customerDetails"))?JSON.parse(sessionStorage.getItem("customerDetails")):this.state.customerDetails,t=r()(this.state.payload);0==Object.keys(e).length&&this.props.history.push("/login"),t={name:e.name,address:e.address,mobileNumber:e.mobileNumber,alternateMobileNumber:e.alternateMobileNumber,area:e.area},this.setState({customerDetails:e,payload:t})}},{key:"render",value:function(){return j("div",{},void 0,A,R,L,j("div",{className:"profile-page-outer"},void 0,this.state.isLoader?E:j("form",{onSubmit:this.updateProfileHandler},void 0,j("div",{className:"row"},void 0,j("div",{className:"col-md-6 col-12"},void 0,j("div",{className:"form-group mr-b-30"},void 0,T,j("input",{value:this.state.payload.name,id:"name",onChange:this.inputChangeHandler,className:"form-control input-lg",type:"text",required:!0}))),j("div",{className:"col-md-6 col-12"},void 0,j("div",{className:"form-group mr-b-30"},void 0,F,j("select",{className:"profile-page-area-box",onChange:this.inputChangeHandler,value:this.state.payload.area,id:"area",required:!0},void 0,q,U,B,G,V,$,K)))),j("div",{className:"row"},void 0,j("div",{className:"col-md-6 col-12"},void 0,j("div",{className:"form-group mr-b-30"},void 0,W,j("input",{value:JSON.parse(sessionStorage.getItem("customerDetails")).mobileNumber,pattern:"[1-9]{1}[0-9]{9}",title:"Enter 10 digit mobile number",id:"mobileNumber",onChange:this.inputChangeHandler,className:"form-control input-lg",type:"tel",required:!0,readOnly:!0}))),j("div",{className:"col-md-6 col-12"},void 0,j("div",{className:"form-group mr-b-30"},void 0,z,j("input",{value:this.state.payload.alternateMobileNumber,pattern:"[1-9]{1}[0-9]{9}",title:"Enter 10 digit mobile number",id:"alternateMobileNumber",onChange:this.inputChangeHandler,className:"form-control input-lg",type:"tel",required:!0})))),j("div",{className:"form-group mr-b-30"},void 0,Q,j("textarea",{rows:"3",cols:"50",value:this.state.payload.address,id:"address",onChange:this.inputChangeHandler,className:"form-control input-lg",type:"text",required:!0})),X)),this.state.isMessageModal&&j(C.a,{modalType:this.state.type,message:this.state.message,onClose:this.modalCloseHandler}))}}])&&H(t.prototype,a),o&&H(t,o),l}(),Z=Object(u.b)({profilePage:y()});var ee=Object(l.connect)(Z,function(e){return{dispatch:e}}),te=Object(m.a)({key:"profilePage",reducer:v}),ae=Object(f.a)({key:"profilePage",saga:S});t.default=Object(d.compose)(te,ae,ee)(Y)}}]);
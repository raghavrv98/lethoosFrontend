(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"016adb9276f5cbd24062":function(e,t,o){"use strict";o.r(t);var a=o("8af190b70a6bc55c6f1b"),r=o.n(a),s=(o("8a2d1b95e05b6a321e74"),o("d7dd51e1bf6bfc2c9c3d")),i=o("0d7f0986bcd2f33d8a2a"),d=o("ab039aecd4a1d4fedc0e"),n=o("a28fc3c963a1d4d1a2e5"),c=o("ab4cb61bcb2dc161defb"),l=o("adc20f99e57c573c589c"),A=o("d95b0cf107403b178365"),m=o("54f683fcda7806277002"),u="app/OrderHistoryPage/DEFAULT_ACTION",g=Object(m.fromJS)({});var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g;switch((arguments.length>1?arguments[1]:void 0).type){case u:default:return e}},f=function(e){return e.get("orderHistoryPage",g)},b=function(){return Object(n.a)(f,function(e){return e.toJS()})},p=regeneratorRuntime.mark(y);function y(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},p)}var E,v=o("600e6bf7eefc3f53a303"),C=o("bd183afcc37eabd79225"),B=o.n(C),I=(Object(d.defineMessages)({header:{id:"".concat("app.containers.OrderHistoryPage",".header"),defaultMessage:"This is the OrderHistoryPage container!"}}),o("4f0dfcf9dfa819c812e6")),Q=(o("fb53a21ab7ecd0262896"),o("3d0272aa0de96073dbf8"));function N(e){return(N="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function x(e,t,o,a){E||(E="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var r=e&&e.defaultProps,s=arguments.length-3;if(t||0===s||(t={children:void 0}),1===s)t.children=a;else if(s>1){for(var i=new Array(s),d=0;d<s;d++)i[d]=arguments[d+3];t.children=i}if(t&&r)for(var n in r)void 0===t[n]&&(t[n]=r[n]);else t||(t=r||{});return{$$typeof:E,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}function O(e,t){for(var o=0;o<t.length;o++){var a=t[o];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function J(e,t){return(J=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function S(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var o,a=j(e);if(t){var r=j(this).constructor;o=Reflect.construct(a,arguments,r)}else o=a.apply(this,arguments);return function(e,t){if(t&&("object"===N(t)||"function"===typeof t))return t;return D(e)}(this,o)}}function D(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function R(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}o.d(t,"OrderHistoryPage",function(){return K});var k=x(i.Helmet,{},void 0,x("title",{},void 0,"OrderHistoryPage"),x("meta",{name:"description",content:"Description of OrderHistoryPage"})),w=x(v.a,{}),H=x("p",{className:"offers-heading"},void 0,"Orders History"),M=x("div",{className:"lds-dual-ring"}),P=x("hr",{}),T=x("span",{className:"order-history-box-text-heading"},void 0,"Order Number :"),Y=x("span",{className:"order-history-box-text-heading"},void 0,"Order Date :"),L=x("span",{className:"order-history-box-btn-text"},void 0,"View Details"),F=x("p",{className:"no-shops-found-heading"},void 0,"No Orders Available"),U=x("i",{className:"fa fa-times-circle","aria-hidden":"true"}),z=x("div",{className:"modal-header"},void 0,x("h5",{className:"modal-title confirm-modal-heading",id:"exampleModalLabel"},void 0,"Order Details")),V=x("hr",{}),_=x("p",{className:"order-history-modal-body-heading"},void 0,"Your Order"),W=x("span",{},void 0,"(Half)"),G=x("hr",{}),K=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&J(e,t)}(d,r.a.PureComponent);var t,a,s,i=S(d);function d(){var e;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d);for(var t=arguments.length,o=new Array(t),a=0;a<t;a++)o[a]=arguments[a];return R(D(e=i.call.apply(i,[this].concat(o))),"state",{customerDetails:{},couponIdCopy:"",detailsModal:!1,isLoader:!0,type:"success"}),R(D(e),"detailsModalHandler",function(t){0,e.setState({detailsModal:!0,modalDetailObject:t})}),R(D(e),"grandTotalBill",function(e,t,o){return parseInt(e)+parseInt(t)-parseInt(o)}),R(D(e),"customerDetailsHandler",function(){var t=window.API_URL+"/customerLogin/".concat(e.state.customerDetails._id);B.a.get(t).then(function(t){var o=t.data;sessionStorage.setItem("customerDetails",JSON.stringify(o)),e.setState({customerDetails:o,isLoader:!1})}).catch(function(t){e.setState({isLoader:!1,message:"Some Error Occured",isMessageModal:!0,type:"failure"})})}),R(D(e),"modalCloseHandler",function(){setTimeout(function(){e.setState({isMessageModal:!1})},1e3)}),R(D(e),"sameMobileNumberCheckHandler",function(e,t){return t===e?t:"".concat(e,", ").concat(t)}),R(D(e),"detailsModalCloseHandler",function(){e.setState({detailsModal:!1})}),e}return t=d,(a=[{key:"componentWillMount",value:function(){var e=this,t=JSON.parse(sessionStorage.getItem("customerDetails"))?JSON.parse(sessionStorage.getItem("customerDetails")):this.state.customerDetails;0==Object.keys(t).length&&this.props.history.push("/login"),this.setState({customerDetails:t},function(){return e.customerDetailsHandler()})}},{key:"render",value:function(){var e=this;return x("div",{},void 0,k,w,H,x("div",{className:"order-history-outer row"},void 0,this.state.isLoader?M:this.state.customerDetails.orderHistory.length>0&&"success"===this.state.type?x(r.a.Fragment,{},void 0,this.state.customerDetails.orderHistory.map(function(t,o){return x("div",{className:"col-md-3 no-padding"},o,x("div",{className:"order-history-box"},void 0,x("div",{className:"row"},void 0,x("div",{className:"col-md-3"},void 0,x("img",{className:"order-history-box-image",src:t.shopImage})),x("div",{className:"col-md-9"},void 0,x("p",{className:"order-history-box-heading"},void 0,t.shopName),x("p",{className:"order-history-box-text-heading"},void 0,t.shopAddress))),P,x("p",{className:"mr-b-10"},void 0,T,x("span",{className:"order-history-box-text"},void 0,t.orderNumber)),x("p",{className:"mr-b-10"},void 0,Y,x("span",{className:"order-history-box-text"},void 0,Object(I.a)(t.orderDate).format("DD MMM YYYY HH:mm"))),x("div",{className:"text-center"},void 0,x("button",{type:"button",onClick:function(){return e.detailsModalHandler(t)},className:"order-history-box-btn"},void 0,L))))})):x(r.a.Fragment,{},void 0,F,x("img",{className:"no-shops-found-image-order-history",src:o("84fdd9fc3b8c8ad38c0e")}),x("img",{className:"no-shops-found-image-glass-order-history",src:o("ef720b82a5e7e5c74fbf")}))),this.state.detailsModal&&x("div",{className:"modal display-block"},void 0,x("div",{className:"modal-dialog",role:"document"},void 0,x("button",{type:"button",className:"close confirm-modal-close",onClick:this.detailsModalCloseHandler},void 0,U),x("div",{className:"modal-content order-history-modal"},void 0,z,x("div",{className:"row"},void 0,x("div",{className:"col-md-3"},void 0,x("img",{className:"order-history-box-image",src:this.state.modalDetailObject.shopImage})),x("div",{className:"col-md-9"},void 0,x("p",{className:"order-history-box-heading"},void 0,this.state.modalDetailObject.shopName),x("p",{className:"order-history-box-text-heading"},void 0,this.state.modalDetailObject.shopAddress),x("p",{className:"order-history-box-text-heading"},void 0,this.state.modalDetailObject.shopMobileNumber))),V,_,this.state.modalDetailObject.orders.map(function(e,t){return x("div",{},t,x("p",{className:"order-history-modal-body-item-portion-text"},void 0,e.portion),e.isHalfSelected?x(r.a.Fragment,{},void 0,x("span",{className:"order-history-modal-body-quantity-text"},void 0,e.item," X ",e.halfQuantity)," ",x("span",{className:"order-history-modal-body-item-cost-text"},void 0,e.price*e.halfQuantity),W):x(r.a.Fragment,{},void 0,x("span",{className:"order-history-modal-body-quantity-text"},void 0,e.item," X ",e.quantity)," ",x("span",{className:"order-history-modal-body-item-cost-text"},void 0,e.price*e.quantity)))}),x("p",{className:"order-history-box-text-heading mr-t-15"},void 0,"Other Specifications ",x("span",{className:"order-history-box-text"},void 0," ",x("textarea",{className:"text-area-order-history",value:this.state.modalDetailObject.otherSpecifications,rows:"1",cols:"15",readOnly:!0}))),x("p",{className:"order-history-box-text-heading mr-t-45"},void 0," Item Total ",x("span",{className:"order-history-box-text"},void 0," ",this.state.modalDetailObject.total)),x("p",{className:"order-history-box-text-heading"},void 0,"Coupon Code ",x("span",{className:"order-history-box-text"},void 0," ",this.state.modalDetailObject.coupon.length>0?this.state.modalDetailObject.coupon:"NA")),x("p",{className:"order-history-box-text-heading"},void 0,"Total Discount ",x("span",{className:"order-history-box-text"},void 0," - ",this.state.modalDetailObject.totalDiscount)),x("p",{className:"order-history-box-text-heading"},void 0,"Delivery Charge ",x("span",{className:"order-history-box-text"},void 0," + ",this.state.modalDetailObject.area.slice(-2))),x("p",{className:"order-history-box-text-heading text-color"},void 0,"Grand Total ",x("span",{className:"order-history-box-text"},void 0," ",this.grandTotalBill(this.state.modalDetailObject.total,this.state.modalDetailObject.area.slice(-2),this.state.modalDetailObject.totalDiscount))),G,x("p",{className:"order-history-box-text-heading"},void 0,"Order Number ",x("span",{className:"order-history-box-text"},void 0," ",this.state.modalDetailObject.orderNumber)),x("p",{className:"order-history-box-text-heading"},void 0,"Payment ",x("span",{className:"order-history-box-text"},void 0," ",this.state.modalDetailObject.paymentMethod)),x("p",{className:"order-history-box-text-heading"},void 0,"Date ",x("span",{className:"order-history-box-text"},void 0," ",Object(I.a)(this.state.modalDetailObject.orderDate).format("DD MMM YYYY HH : mm"))),x("p",{className:"order-history-box-text-heading"},void 0,"Phone Number ",x("span",{className:"order-history-box-text"},void 0," ",this.sameMobileNumberCheckHandler(this.state.customerDetails.mobileNumber,this.state.modalDetailObject.orderAlternateMobileNumber))),x("p",{className:"order-history-box-text-heading"},void 0,"Deliver To ",x("span",{className:"order-history-box-text"},void 0," ",x("textarea",{className:"text-area-order-history",value:this.state.modalDetailObject.orderAddress,rows:"2",cols:"25",readOnly:!0})))))),this.state.isMessageModal&&x(Q.a,{modalType:this.state.type,message:this.state.message,onClose:this.modalCloseHandler}))}}])&&O(t.prototype,a),s&&O(t,s),d}(),Z=Object(n.b)({orderHistoryPage:b()});var X=Object(s.connect)(Z,function(e){return{dispatch:e}}),q=Object(A.a)({key:"orderHistoryPage",reducer:h}),$=Object(l.a)({key:"orderHistoryPage",saga:y});t.default=Object(c.compose)(q,$,X)(K)},"84fdd9fc3b8c8ad38c0e":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwEAAAK7BAMAAABYF56BAAAAElBMVEVHcEwAAAA7OzscHBy3t7e0tLTCYgfOAAAAAXRSTlMAQObYZgAABJRJREFUeNrt3dFtwjAUQFG6QRsWQJ6gVTpAJbwB8v6r9KeioijFAWJHeed+VpWMOF+OyHu7nSRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRVVMr48abfxs/8RYAAgYaNoy/9sv34ToAAAQKBBHzj170SIECAAAECBAgQaCvQ9tC1RoAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECLQ69N+GdPj575Sm/+S3EgQIECBAgAABAgTcB9zICBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEZhx6ez3NfsmFLeVUczwBAgQ2LFCzHGXBdSE1G7r2IwECBAgQWOzQzi9c1R1PgAABAgQIECBAYNsCE5/lpZHAjeMJECBAgAABAgQIENjdP2frPKjrMYF7jk+JAAECBAgQIECAgPuA+wABAgQIECBAgAABAgQIECBAgAABAgQ2/3R6mHwc/ZDAv8fXHkmAAAECBAgQIEDAfcB9gAABAgQIECBAgICpBgQIECBAgAABAgR6Cpj4SoAAgb4COXfdP5CP4fcPECBAgEBfgZgRIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECg3aGldH2PrJzCv0dGgEB0AVMNCBAgQCC2gBlbBAgQIECAAAECBLoL2D9AgAABAgQIECBAYPUCtbtZz/tS01MF5h4/+REIECBAgAABAgQIuA+4DxAgQIAAAQIECBAgQIAAAQIECBAgUCfwtIeT9wnUHj8kAgQIECBAgAABAu4D7gMECBAgQIAAAQIEagS8U0+AAAECBAgQIECgg4B5owQIECAQWyDnrvsH8jH8/gECBKILxIwAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQLtDi2l63tk5RT+PTICBAgQ6CtgqgEBAgT6CpixRYAAAQIECBAgQKC7gP0DBAgQIECAAAECBFYvULMcdUiHpQTmrIZ9YCUsAQIECBAgQIAAAfcB9wECBAgQIECAAAECBAgQIECAAAECBAisRWDO4+GLR8WHpwjcefz183ICBAgQIECAAAEC7gPuAwQIECBAgAABAgRMNSBAgAABAgQIECDQS8DEVwIECBCILZBz1/0D+Rh+/wABAtEFYkaAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBLYooBajwwgQIECAAAECBAj8qWakX6wWHGBIgAABAisUuD1UMVhLjpAkQICAJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSpC31DcKrMKHmWSojAAAAAElFTkSuQmCC"}}]);
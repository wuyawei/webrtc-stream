(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7411ab38","chunk-45e6607f"],{"0367":function(t,n,i){},"152e":function(t,n,i){},"66b0":function(t,n,i){"use strict";i.r(n);var e=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("div",{staticClass:"communication-sub"},[i("p",[t._v("我是 communication-sub")]),"checkbox"===t.$attrs.type?i("input",t._g(t._b({directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.title)?t._i(t.title,null)>-1:t.title},on:{change:function(n){var i=t.title,e=n.target,c=!!e.checked;if(Array.isArray(i)){var o=null,a=t._i(i,o);e.checked?a<0&&(t.title=i.concat([o])):a>-1&&(t.title=i.slice(0,a).concat(i.slice(a+1)))}else t.title=c}}},"input",t.$attrs,!1),t.$listeners)):"radio"===t.$attrs.type?i("input",t._g(t._b({directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],attrs:{type:"radio"},domProps:{checked:t._q(t.title,null)},on:{change:function(n){t.title=null}}},"input",t.$attrs,!1),t.$listeners)):i("input",t._g(t._b({directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],attrs:{type:t.$attrs.type},domProps:{value:t.title},on:{input:function(n){n.target.composing||(t.title=n.target.value)}}},"input",t.$attrs,!1),t.$listeners)),i("communication-min-sub")],1)},c=[],o=i("bb41"),a={name:"communication-sub",inheritAttrs:!1,props:{title:{type:String,default:""}},components:{communicationMinSub:o["default"]},data:function(){return{}},methods:{},mounted:function(){console.log("111",this.$listeners)}},s=a,u=(i("70cc"),i("2877")),r=Object(u["a"])(s,e,c,!1,null,"373f10e0",null);n["default"]=r.exports},"70cc":function(t,n,i){"use strict";var e=i("0367"),c=i.n(e);c.a},"7f7f":function(t,n,i){var e=i("86cc").f,c=Function.prototype,o=/^\s*function ([^ (]*)/,a="name";a in c||i("9e1e")&&e(c,a,{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},9114:function(t,n,i){"use strict";var e=i("152e"),c=i.n(e);c.a},bb41:function(t,n,i){"use strict";i.r(n);var e=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("div",{staticClass:"communication-min-sub"},[i("p",[t._v("我是 communication-min-sub")]),i("button",{on:{click:t.onCommunicationClick}},[t._v("click")]),i("button",{on:{click:t.busClick}},[t._v("click bus")]),i("button",{on:{click:t.handleDispatch}},[t._v("dispatch")])])},c=[];i("7f7f");function o(t,n,i){this.$children.forEach(function(e){var c=e.$options.name;c===t?e.$emit.apply(e,[n].concat(i)):o.apply(e,[t,n].concat([i]))})}var a={methods:{dispatch:function(t,n,i){var e=this.$parent||this.$root,c=e.$options.name;while(e&&(!c||c!==t))e=e.$parent,e&&(c=e.$options.name);e&&e.$emit.apply(e,[n].concat(i))},broadcast:function(t,n,i){o.call(this,t,n,i)}}},s={name:"communication-min-sub",inheritAttrs:!1,mixins:[a],data:function(){return{}},inject:["onCommunicationClick"],methods:{emitClick:function(){this.$emit("emitClick","emit 触发了")},busClick:function(){this.$bus.$emit("busClick","bus 触发了")},handleDispatch:function(){this.dispatch("communication","onMessage","触发了dispatch")}},mounted:function(){}},u=s,r=(i("9114"),i("2877")),l=Object(r["a"])(u,e,c,!1,null,"426ef4ce",null);n["default"]=l.exports}}]);
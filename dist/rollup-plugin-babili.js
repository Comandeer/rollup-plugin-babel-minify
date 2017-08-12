/*! rollup-plugin-babili v3.1.0 | (c) 2017 undefined | MIT license (see LICENSE) */
"use strict";function _interopDefault(n){return n&&"object"==typeof n&&"default"in n?n.default:n}function filterBabiliOptions(n){var e=["banner","sourceMap","comments"],r={};return Object.keys(n).filter(function(i){-1===e.indexOf(i)&&(r[i]=n[i])}),r}function isString(n){return null!=n&&"string"==typeof n}function isFn(n){return null!=n&&"function"==typeof n}function isFnOrString(n){return isString(n)||isFn(n)}function babili(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=void 0;return{name:"babili",options:function(n){var r=n.banner;e=r},transformBundle:function(r){var i=filterBabiliOptions(n),t={presets:[[babiliPreset,i]],sourceMaps:void 0===n.sourceMap||Boolean(n.sourceMap),comments:void 0===n.comments||Boolean(n.comments)};if(isFnOrString(n.banner)||isFnOrString(e)){var o=n.banner||e;o=isFn(o)?o():o;var a=_comandeer_babelPluginBanner_utils.getCommentContent(o),u=!1;t.plugins=[[bannerPlugin,{banner:o}]],t.comments||(t.shouldPrintComment=function(n){return!u&&n===a&&(u=!0,!0)})}var l=babelCore.transform(r,t);return{code:l.code,map:l.map}}}}var babiliPreset=_interopDefault(require("babel-preset-babili")),bannerPlugin=_interopDefault(require("@comandeer/babel-plugin-banner")),_comandeer_babelPluginBanner_utils=require("@comandeer/babel-plugin-banner/utils"),babelCore=require("babel-core");module.exports=babili;
//# sourceMappingURL=rollup-plugin-babili.js.map

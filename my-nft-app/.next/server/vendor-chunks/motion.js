"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion";
exports.ids = ["vendor-chunks/motion"];
exports.modules = {

/***/ "(ssr)/./node_modules/motion/dist/animate.es.js":
/*!************************************************!*\
  !*** ./node_modules/motion/dist/animate.es.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animate: () => (/* binding */ animate),\n/* harmony export */   animateProgress: () => (/* binding */ animateProgress)\n/* harmony export */ });\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/animate/utils/controls.es.js\");\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/animate/index.es.js\");\n/* harmony import */ var _motionone_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @motionone/utils */ \"(ssr)/./node_modules/@motionone/utils/dist/is-function.es.js\");\n/* harmony import */ var _motionone_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @motionone/animation */ \"(ssr)/./node_modules/@motionone/animation/dist/Animation.es.js\");\n\n\n\n\nfunction animateProgress(target, options = {}) {\n    return (0,_motionone_dom__WEBPACK_IMPORTED_MODULE_0__.withControls)([\n        () => {\n            const animation = new _motionone_animation__WEBPACK_IMPORTED_MODULE_1__.Animation(target, [0, 1], options);\n            animation.finished.catch(() => { });\n            return animation;\n        },\n    ], options, options.duration);\n}\nfunction animate(target, keyframesOrOptions, options) {\n    const factory = (0,_motionone_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(target) ? animateProgress : _motionone_dom__WEBPACK_IMPORTED_MODULE_3__.animate;\n    return factory(target, keyframesOrOptions, options);\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvYW5pbWF0ZS5lcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBb0U7QUFDdEI7QUFDRzs7QUFFakQsNkNBQTZDO0FBQzdDLFdBQVcsNERBQVk7QUFDdkI7QUFDQSxrQ0FBa0MsMkRBQVM7QUFDM0MsOENBQThDO0FBQzlDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0REFBVSw2QkFBNkIsbURBQVM7QUFDcEU7QUFDQTs7QUFFb0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZW1wbGF0ZS1uZXh0LXNlaS1hcHAvLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvYW5pbWF0ZS5lcy5qcz80MTM3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUgYXMgYW5pbWF0ZSQxLCB3aXRoQ29udHJvbHMgfSBmcm9tICdAbW90aW9ub25lL2RvbSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnQG1vdGlvbm9uZS91dGlscyc7XG5pbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tICdAbW90aW9ub25lL2FuaW1hdGlvbic7XG5cbmZ1bmN0aW9uIGFuaW1hdGVQcm9ncmVzcyh0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB3aXRoQ29udHJvbHMoW1xuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uKHRhcmdldCwgWzAsIDFdLCBvcHRpb25zKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbi5maW5pc2hlZC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgICAgICAgfSxcbiAgICBdLCBvcHRpb25zLCBvcHRpb25zLmR1cmF0aW9uKTtcbn1cbmZ1bmN0aW9uIGFuaW1hdGUodGFyZ2V0LCBrZXlmcmFtZXNPck9wdGlvbnMsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBmYWN0b3J5ID0gaXNGdW5jdGlvbih0YXJnZXQpID8gYW5pbWF0ZVByb2dyZXNzIDogYW5pbWF0ZSQxO1xuICAgIHJldHVybiBmYWN0b3J5KHRhcmdldCwga2V5ZnJhbWVzT3JPcHRpb25zLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgYW5pbWF0ZSwgYW5pbWF0ZVByb2dyZXNzIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion/dist/animate.es.js\n");

/***/ })

};
;
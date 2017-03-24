/* globals __DEV__ */

if (!__DEV__) {
    var console = {}
    console.log = function(){}
    window.console = console
}

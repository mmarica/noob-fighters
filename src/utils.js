/* globals __DEV__ */
export const centerGameObjects = (objects) => {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5)
    })
}

if (!__DEV__) {
    var console = {}
    console.log = function(){}
    window.console = console
}

/* globals __DEV__ */

export const log = function (context, message) {
    if (!__DEV__)
        return

    console.log("[" + context + "] " + message)
}

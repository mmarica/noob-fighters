/* globals __DEV__ */

export const log = function (context, message) {
    if (!__DEV__)
        return

    console.log("[" + context + "] " + message)
}

export const animationFramesFromRange = function (animation) {
    let frames = []

    for (let i = 0; i < animation["count"]; i++)
        frames.push(i +  animation["start"])

    return frames
}

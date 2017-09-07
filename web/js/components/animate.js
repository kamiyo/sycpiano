const animateFn = (
    startValue = 0,
    endValue = 1,
    duration = 200, // ms
    fn,             // the function to use as animation (is called every frame)
    easing,         // function input: t => [0, 1], output: eased t => [0, 1]
    callback        // callback for when animation finishes (i.e. return promise)
) => {
    if (!fn) {
        return;
    }
    if (!easing) {
        easing = (t) => (t);
    }

    let startTimestamp = null;
    const duration_inv = 1 / duration;    // to avoid dividing in the loop
    const startToEndValue = endValue - startValue;

    const animationStep = timestamp => {
        if (!startTimestamp) {
            startTimestamp = timestamp;
            window.requestAnimationFrame(animationStep);
        } else {
            // elapsed time normalized to [0, 1]
            const t_elapsed = (timestamp - startTimestamp) * duration_inv;
            if (t_elapsed >= 1.0) {
                if (callback) callback();
                return;
            }
            const t_eased = easing(t_elapsed);
            const currentValue = startValue + startToEndValue * t_eased;
            fn(currentValue);
            window.requestAnimationFrame(animationStep);
        }
    };

    window.requestAnimationFrame(animationStep);
}

export default animateFn;
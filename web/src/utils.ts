type PolarToCartesianShape = (
    radius: number,
    angle: number,
    offset?: [number, number],
) => [number, number];

export const polarToCartesian: PolarToCartesianShape = (radius, angle, offset = [0, 0]) => (
    [
        radius * Math.cos(angle) + offset[0],
        radius * Math.sin(angle) + offset[1],
    ]
);

type CartesianToPolarShape = (
    x: number,
    y: number,
) => { radius: number, angle: number };

export const cartesianToPolar: CartesianToPolarShape = (x, y) => (
    {
        radius: Math.sqrt(x * x + y * y),
        angle: Math.atan2(y, x),
    }
);

export const formatTime = (current: number) => {
    if (current === -1) {
        return '--:--';
    }
    const minutes = Math.floor(current / 60);
    const seconds = Math.floor(current - 60 * minutes);
    const minutesDisplay = `${minutes < 10 ? '0' : ''}${minutes}`;
    const secondsDisplay = `${seconds < 10 ? '0' : ''}${seconds}`;
    return `${minutesDisplay}:${secondsDisplay}`;
};

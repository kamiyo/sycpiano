type PolarToCartesianShape = (
    radius: number,
    angle: number,
    offset?: [number, number],
) => [number, number];

export const polarToCartesian: PolarToCartesianShape = (radius, angle, offset) => (
    offset ? (
    [
        radius * Math.cos(angle) + offset[0],
        radius * Math.sin(angle) + offset[1],
    ])
    :
    ([
        radius * Math.cos(angle),
        radius * Math.sin(angle),
    ])
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

const AudioContextFill = (window as any).AudioContext || (window as any).webkitAudioContext;
const acx: AudioContext = new AudioContextFill();

export const getAudioContext: any = () => {
    if (acx.state === 'suspended') {
        const resume = async () => {
            await acx.resume();
            if (acx.state === 'running') {
                document.body.removeEventListener('touchend', resume, false);
            }
        };

        document.body.addEventListener('touchend', resume, false);
    }
    return acx;
};

export const getLastName = (name: string) => {
    return /([^\s]+)\s?(?:\(.*\))?$/.exec(name)[1];
};

export const normalizeString = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f":()',\.-]/g, '').replace(/\s+/g, '-').replace(/_$/, '');
};

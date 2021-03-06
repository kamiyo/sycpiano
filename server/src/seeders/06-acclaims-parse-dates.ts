import * as moment from 'moment-timezone';
import { ModelMap } from 'types';

export const up = async (models: ModelMap): Promise<void> => {
    const model = models.acclaim;
    const acclaims = await model.findAll({
        attributes: ['id', 'oldDate'],
    });
    try {
        await Promise.each(acclaims, async (acclaim) => {
            const oldDate = acclaim.oldDate;
            let hasFullDate = true;
            const newDate = moment(oldDate, ['MMMM YYYY', 'MM/DD/YYYY']);
            if (oldDate.indexOf(' ') !== -1) {
                hasFullDate = false;
            }
            await acclaim.update({
                hasFullDate,
                date: newDate,
            });
        });
    } catch (e) {
        console.log(e);
    }
};

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
export const down = (): void => { };

import * as Promise from 'bluebird';
import * as moment from 'moment-timezone';
import { AcclaimInstance, AcclaimModel, ModelMap } from 'types';

export const up = async (models: ModelMap) => {
    const model: AcclaimModel = models.acclaim as AcclaimModel;
    const acclaims: AcclaimInstance[] = await model.findAll({
        attributes: ['id', 'oldDate'],
    });
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
};

/* tslint:disable-next-line:no-empty */
export const down = () => {};
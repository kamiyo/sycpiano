const fs = require('fs');
const fancyLog = require('fancy-log');
const moment = require('moment-timezone/moment-timezone-utils');

const packedLatest = require('moment-timezone/data/packed/latest.json');

function unpackAndUnlink(latest) {
    const unpacked = {
        ...latest,
        zones: latest.zones.map(moment.tz.unpack),
        links: []
    };

    latest.links.forEach(link => {
        const [leadTzName, alias] = link.split('|');
        const leadTzData = unpacked.zones.find(zone => zone.name === leadTzName);

        unpacked.zones.push({
            ...leadTzData,
            name: alias
        });
    });

    return unpacked;
}

const filePath = './web/assets/data/tz-2000-2050.json'

function main(done) {
    if (fs.existsSync(filePath)) {
        fancyLog('[tz-data] Timezone data already exists. Skipping generation.')
        done();
        return;
    }

    const unpackedLatest = unpackAndUnlink(packedLatest);

    const packed = moment.tz.filterLinkPack(unpackedLatest, 2000, 2050);

    fs.writeFile(filePath, JSON.stringify(packed), 'utf8', (err) => {
        if (err) {
            fancyLog('[tz-data] Failed to generate new timezone data for 2000-2050.');
        }
        else {
            fancyLog('[tz-data] Timezone data generated and saved at ', filePath);
        }
        done();
    });
}

module.exports = main;

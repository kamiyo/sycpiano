import jbinary from 'jbinary';
import jdv from 'jdataview';

export function loadWaveformFile(filename) {
    return new Promise((resolve, reject) => {
        jbinary.loadData(filename, (error, data) => {
            const j = new jbinary(new jdv(data, 0, data.byteLength, true));
            const header = j.read({
                version: 'int32',
                flags: 'uint32',
                sampleRate: 'int32',
                samplesPerPixel: 'int32',
                length: 'uint32'
            });
            const type = header.flags ? 'int8' : 'int16'
            const body = j.read({
                values: ['array', type]
            });
            console.log(header);
            console.log(body);
            resolve({ header: header, body: body });
        });
    })
}
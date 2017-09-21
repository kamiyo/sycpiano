import jbinary from 'jbinary';
import jdv from 'jdataview'
import math from 'mathjs';

class ConstantQ {
    constructor() {
        this._pmatrix = null
        this.loadMatrix();
    }
    loadFile(filename, type, type_numbytes) {
        return new Promise((resolve, reject) => {
            jbinary.loadData(filename, function (error, data) {
                const temp = [];
                let j = new jbinary(new jdv(data, 0, data.byteLength, true));
                let size = data.byteLength / type_numbytes;
                for (let i = 0; i < size; ++i) {
                    temp.push(j.read(type));
                }
                resolve(temp);
            });
        });
    }
    loadMatrix() {
        const pvalues = this.loadFile('/binary/values.dat', 'float64', 8);
        const pindices = this.loadFile('/binary/indices.dat', 'int32', 4);
        const ppointers = this.loadFile('/binary/pointers.dat', 'int32', 4);
        Promise.all([pvalues, pindices, ppointers]).then(data => {
            let o = {
                mathjs: "SparseMatrix",
                values: data[0],
                index: data[1],
                ptr: data[2],
                size: [8192, 42],
                datatype: 'number'
            };
            this._pmatrix = math.transpose(math.type.SparseMatrix.fromJSON(o));
        });
    }
    apply(input) {
        if (this._pmatrix) {
            return math.transpose(math.matrix(math.multiply(this._pmatrix, input), 'dense')).toArray();
        }
    }
}

const constantQ = new ConstantQ();

export default constantQ;
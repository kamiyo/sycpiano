import jbinary from 'jbinary';
import jdv from 'jdataview';
import math from 'mathjs';

class ConstantQ {
    constructor() {
        this._pmatrix = null;
        this.loaded = this.loadMatrix();
    }

    loadFile = (filename, type) => (
        new Promise((resolve, reject) => {
            jbinary.loadData(filename, (error, data) => {
                const j = new jbinary(new jdv(data, 0, data.byteLength, true));
                const parsedData = j.read({ values: ['array', type] });
                resolve(parsedData.values);
            });
        })
    );

    loadMatrix = () => (
        Promise.all([
            this.loadFile('/binary/values.dat', 'float32'),
            this.loadFile('/binary/indices.dat', 'int32'),
            this.loadFile('/binary/pointers.dat', 'int32')
        ]).then(data => {
            let o = {
                mathjs: "SparseMatrix",
                values: data[0],
                index: data[1],
                ptr: data[2],
                size: [8192, 42],
                datatype: "number"
            };
            this._pmatrix = math.type.SparseMatrix.fromJSON(o);
        })
    );

    apply(input) {
        if (this._pmatrix) {
            const inputMatrix = new math.type.DenseMatrix.fromJSON({ "mathjs": "DenseMatrix", data: [input], size: [1, 8192], datatype: 'number' });
            const result = math.multiply(inputMatrix, this._pmatrix).toArray();
            return result[0];
        }
        return input;
    }
}

const constantQ = new ConstantQ();

export default constantQ;
import jbinary from 'jbinary';
import jdv from 'jdataview'
import math from 'mathjs';

class ConstantQ {
    constructor() {
        this._pmatrix = null;
        this.loaded = this.loadMatrix();
        this.firstNonZero = null;
    }

    loadFile = (filename, type, type_numbytes) => (
        new Promise((resolve, reject) => {
            jbinary.loadData(filename, (error, data) => {
                const temp = [];
                let j = new jbinary(new jdv(data, 0, data.byteLength, true));
                let size = data.byteLength / type_numbytes;
                for (let i = 0; i < size; ++i) {
                    temp.push(j.read(type));
                }
                resolve(temp);
            });
        })
    )

    loadMatrix() {
        const pvalues = this.loadFile('/binary/values.dat', 'float32', 4);
        const pindices = this.loadFile('/binary/indices.dat', 'int32', 4);
        const ppointers = this.loadFile('/binary/pointers.dat', 'int32', 4);
        return Promise.all([pvalues, pindices, ppointers]).then(data => {
            let o = {
                mathjs: "SparseMatrix",
                values: data[0],
                index: data[1],
                ptr: data[2],
                size: [8192, 42],
                datatype: 'number'
            };
            this._pmatrix = math.type.SparseMatrix.fromJSON(o);
            this.firstNonZero = data[1][0];
            console.log(this._pmatrix.toArray());
        });
    }

    apply(input) {
        if (this._pmatrix) {
            const inputMatrix = new math.type.DenseMatrix.fromJSON({"mathjs": "DenseMatrix", data: [input], size: [1, 8192], datatype: 'number'});
            const result = math.multiply(inputMatrix, this._pmatrix).toArray();
            return result[0];
        }
        return new Array();
    }
}

const constantQ = new ConstantQ();

export default constantQ;
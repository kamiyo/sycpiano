declare module 'mathjs' {
    export class SparseMatrix {
        fromJSON: (object: Object) => SparseMatrix;
    }

    export class DenseMatrix {
        fromJSON: (object: Object) => DenseMatrix;
        toArray: () => ArrayLike<ArrayLike<number>>;
    }

    export function multiply(d: DenseMatrix, a: any): DenseMatrix;

    interface configOptions {
        epsilon?: number;
        matrix?: string;
        number?: string;
        precision?: number;
        predictable?: boolean;
        randomSeed?: string;
    }

    interface dependencies {
        SparseMatrix: SparseMatrix;
        DenseMatrix: DenseMatrix;
        multiply: typeof multiply;
    }

    export function factory (name: string, dependencies: string[], create: Function): Function;
    export function create (factories: {[key: string]: typeof factory}, config: configOptions): dependencies;
    export function SparseMatrixDependencies (name: string, dependencies: string[], create: Function): Function;
    export function multiplyDependencies (name: string, dependencies: string[], create: Function): Function;
    export function DenseMatrixDependencies (name: string, dependencies: string[], create: Function): Function;
}
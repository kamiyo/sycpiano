declare module 'collections/sorted-array' {
    export class SortedArray<T> extends Array<T> {
        length: number;
        Iterator: Iterator;
        isSorted: boolean;
        constructor(
            values?: T[],
            equals?: (a: T, b: T) => boolean,
            compare?: (a: T, b: T) => number,
            getDefault?: any
        );
        constructClone(values?: T[]): SortedArray<T>;
        has(value: T): boolean;
        get(value: T): T | undefined;
        add(value: T): boolean;
        addEach(...args: any): void;
        ['delete'](value: T): boolean;
        deleteAll(value: T, equals: (...args: any[]) => any): number;
        toggle(value: T): void;
        indexOf(value: T): number;
        lastIndexOf(value: T): number;
        findValue(value: T): number;
        findLastValue(value: T): number;
        push(...args: T[]): void;
        unshift(...args: T[]): void;
        pop(): T;
        shift(): T;
        slice(): SortedArray<T>;
        splice(index: number, length: number, ...args: any[]): SortedArray<T>;
        swap(index: number, length: number, plus: any): SortedArray<T>;
        reduce(callback: (result?: any, val?: any, key?: any, collection?: any) => any,
            basis?: any, thisp?: any): any;
        reduceRight(
            callback: (result?: any, val?: any, key?: any, collection?: any) => any,
            basis?: any, thisp?: any
        ): any;
        min(): T;
        max(): T;
        one(): T;
        clear(): void;
        equals(that: any, equals?: (...args: any[]) => boolean): boolean;
        compare(that: any, compare?: (...args: any[]) => boolean): boolean;
        iterate(start: number, end: number): Iterator<T>;
        toJSON(): T[];
    }
}

declare module 'collections/sorted-array-set' {
    export class SortedArraySet<T> extends Array<T> {
        length: number;
        Iterator: Iterator;
        isSorted: boolean;
        isSet: boolean;
        constructor(
            values?: T[],
            equals?: (a: T, b: T) => boolean,
            compare?: (a: T, b: T) => number,
            getDefault?: any
        );
        constructClone(values?: T[]): SortedArraySet<T>;
        has(value: T): boolean;
        get(value: T): T | undefined;
        add(value: T): boolean;
        addEach(...args: any): void;
        ['delete'](value: T): boolean;
        deleteAll(value: T, equals: (...args: any[]) => any): number;
        indexOf(value: T): number;
        lastIndexOf(value: T): number;
        findValue(value: T): number;
        findLastValue(value: T): number;
        push(...args: T[]): void;
        unshift(...args: T[]): void;
        pop(): T;
        shift(): T;
        union(...args: any): SortedArraySet<T>;
        intersection(...args: any): SortedArraySet<T>;
        difference(...args: any): SortedArraySet<T>;
        symmetricDifference(...args: any): SortedArraySet<T>;
        slice(): SortedArraySet<T>;
        splice(index: number, length: number, ...args: any[]): SortedArSortedArraySetray<T>;
        swap(index: number, length: number, plus: any): SortedArraySet<T>;
        reduce(callback: (result?: any, val?: any, key?: any, collection?: any) => any,
            basis?: any, thisp?: any): any;
        reduceRight(
            callback: (result?: any, val?: any, key?: any, collection?: any) => any,
            basis?: any, thisp?: any
        ): any;
        min(): T;
        max(): T;
        one(): T;
        clear(): void;
        equals(that: any, equals?: (...args: any[]) => boolean): boolean;
        compare(that: any, compare?: (...args: any[]) => boolean): boolean;
        iterate(start: number, end: number): Iterator<T>;
        toJSON(): T[];
        toArray(): T[];
    }
}
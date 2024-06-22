function __typeCheck(o, types, names) {
    for (const i in types) {
        const type = types[i];
        const name = names[i];
        if (type instanceof Function) {
            if ([
                    'Boolean',
                    'BigInt',
                    'Symbol',
                    'Function',
                    'String',
                    'Number'
                ].includes(name) && (o instanceof type || typeof o === name.toLowerCase()))
                return;
            else if (o instanceof type)
                return;
        } else if (o === type)
            return;
    }
    throw new Error('no');
}
function __binOp(a, b, opStr, original) {
    return a[opStr] ? a[opStr](b) : b[opStr] ? b[opStr](a) : original(a, b);
}
function __unOp(a, opStr, original) {
    return a[opStr] ? a[opStr]() : original(a);
}
function __updateOp(a, opStr, original) {
    a[opStr] ? a[opStr]() : original(a);
    return a;
}
function __assignOp(a, b, opStr, original) {
    a[opStr] ? a[opStr](b) : original(a, b);
    return a;
}
class Vec2 {
    constructor(x, y) {
        __typeCheck(y, [Number], ['Number']);
        __typeCheck(x, [Number], ['Number']);
        this.x = x;
        this.y = y;
    }
    '+'(o) {
        __typeCheck(o, [Vec2], ['Vec2']);
        return new Vec2(__binOp(this.x, o.x, '+', (a, b) => a + b), __binOp(this.y, o.y, '+', (a, b) => a + b));
    }
    '-'(o) {
        __typeCheck(o, [Vec2], ['Vec2']);
        return new Vec2(__binOp(this.x, o.x, '-', (a, b) => a - b), __binOp(this.y, o.y, '-', (a, b) => a - b));
    }
    'u-'() {
        return new Vec2(__unOp(this.x, 'u-', a => -a), __unOp(this.y, 'u-', a => -a));
    }
    '*'(o) {
        __typeCheck(o, [Number], ['Number']);
        return new Vec2(__binOp(this.x, o, '*', (a, b) => a * b), __binOp(this.y, o, '*', (a, b) => a * b));
    }
    '/'(o) {
        __typeCheck(o, [Number], ['Number']);
        return new Vec2(__binOp(this.x, o, '/', (a, b) => a / b), __binOp(this.y, o, '/', (a, b) => a / b));
    }
    '++'() {
        console.log(true);
        __updateOp(this.x, '++', a => a++);
        __updateOp(this.y, '++', a => a++);
    }
    '+='(o) {
        __typeCheck(o, [Vec2], ['Vec2']);
        __assignOp(this.x, o.x, '+=', (a, b) => a += b);
        __assignOp(this.y, o.y, '+=', (a, b) => a += b);
    }
}
const test = new Vec2(1, 1);
__assignOp(test, new Vec2(2, 2), '+=', (a, b) => a += b);
console.log(test);
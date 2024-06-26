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
    if ([
            '<',
            '>',
            '<=',
            '>='
        ].includes(opStr))
        return __relOp(a, b, opStr, original);
    if (a === undefined || a === null) {
        if (b === undefined || a === null)
            return original(a, b);
        return b[opStr] ? b[opStr](a, true) : original(a, b);
    }
    return a[opStr] ? a[opStr](b, false) : b[opStr] ? b[opStr](a, true) : original(a, b);
}
function __relOp(a, b, opStr, original) {
    const opposite = (opStr[0] === '<' ? '>' : '<') + (opStr[1] === '=' ? '' : '=');
    const reverse = (opStr[0] === '<' ? '>' : '<') + (opStr[1] === '=' ? '=' : '');
    const opReverse = opStr[0] + (opStr[1] === '=' ? '' : '=');
    if (!(a === undefined || a === null)) {
        if (a[opStr])
            return a[opStr](b);
        if (a[opposite])
            return !a[opposite];
    }
    if (b === undefined || b === null)
        return original(a, b);
    if (b[reverse])
        return b[reverse](a);
    if (b[opReverse])
        return !b[opReverse](a);
    return original(a, b);
}
function __unOp(a, opStr, original) {
    if (a === undefined || a === null)
        return original(a);
    return a[opStr] ? a[opStr]() : original(a);
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
        this.x['++'] ? this.x['++']() : this.x++;
        this.y['++'] ? this.y['++']() : this.y++;
    }
    '>'(o) {
        __typeCheck(o, [Number], ['Number']);
        return __binOp(this.x, o, '>', (a, b) => a > b);
    }
    '>='(o) {
        __typeCheck(o, [Number], ['Number']);
        return __binOp(this.x, o, '>=', (a, b) => a >= b);
    }
}
let a = new Vec2(3, 3);
let b = 4;
function check(a = 3, {
    b = 3
} = {}, [c = 3] = []) {
    __typeCheck(c, [Vec2], ['Vec2']);
    __typeCheck(b, [Vec2], ['Vec2']);
    __typeCheck(a, [Vec2], ['Vec2']);
}
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    '+'(o) {
        return new Vec2(this.x['+'] ? this.x['+'](o.x) : o.x['+'] ? o.x['+'](this.x) : this.x + o.x, this.y['+'] ? this.y['+'](o.y) : o.y['+'] ? o.y['+'](this.y) : this.y + o.y);
    }
    '-'(o) {
        return new Vec2(this.x['-'] ? this.x['-'](o.x) : o.x['-'] ? o.x['-'](this.x) : this.x - o.x, this.y['-'] ? this.y['-'](o.y) : o.y['-'] ? o.y['-'](this.y) : this.y - o.y);
    }
    'u-'() {
        return new Vec2(this.x['u-'] ? this.x['u-']() : -this.x, this.y['u-'] ? this.y['u-']() : -this.y);
    }
    '*'(o) {
        return new Vec2(this.x['*'] ? this.x['*'](o) : o['*'] ? o['*'](this.x) : this.x * o, this.y['*'] ? this.y['*'](o) : o['*'] ? o['*'](this.y) : this.y * o);
    }
    '/'(o) {
        return new Vec2(this.x['/'] ? this.x['/'](o) : o['/'] ? o['/'](this.x) : this.x / o, this.y['/'] ? this.y['/'](o) : o['/'] ? o['/'](this.y) : this.y / o);
    }
}
function a(t, a) {
}
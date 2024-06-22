function __updateOp(a, opStr, original) {
    console.log(a);
    original(a);
    console.log(a);
    return;
    a[opStr] ? a[opStr]() : original(a);
    return a;
}

let j = 3;
function test(t) {
    console.log(t);
    t++;
    console.log(t);
}
//__updateOp(test, "++", a => (a++));
test(j);
console.log(j);

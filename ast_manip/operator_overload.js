const { Parser } = require("../acornMod.js");

const overloadables = [
    "+", "-",
    "!", "~",
    "||", "&&",
    "|", "^", "&",
    "==", "!=", "===", "!==", "??",
    "<", ">", "<=", ">=",
    "<<", ">>", ">>>",
    "++", "--",
    "%", "*", "**", "/"
]
const assignables = ["+","-","*","/","%","**","<<",">>",">>>","&","^","|","&&","||","??"];
assignables.forEach(op => overloadables.push(op + "="));

const ooFuncCode = `
function __binOp(a, b, opStr, original) {
    if (["<",">","<=",">="].includes(opStr)) return __relOp(a, b, opStr, original);
    if (a === undefined || a === null) {
        if (b === undefined || a === null) return original(a, b);
        return b[opStr] ? b[opStr](a, true) : original(a, b);
    }
    return (a[opStr] ? a[opStr](b, false) : b[opStr] ? b[opStr](a, true) : original(a, b));
}
function __relOp(a, b, opStr, original) {
    const opposite = (opStr[0] === "<" ? ">" : "<") + (opStr[1] === "=" ? "" : "=");
    const reverse = (opStr[0] === "<" ? ">" : "<") + (opStr[1] === "=" ? "=" : "");
    const opReverse = opStr[0] + (opStr[1] === "=" ? "" : "=");
    if (!(a === undefined || a === null)) { //do a options
        if (a[opStr]) return a[opStr](b);
        if (a[opposite]) return !(a[opposite])
    }
    if (b === undefined || b === null) return original(a, b);
    if (b[reverse]) return b[reverse](a);
    if (b[opReverse]) return !(b[opReverse](a));
    return original(a, b);
}
function __unOp(a, opStr, original) {
    if (a === undefined || a === null) return original(a);
    return (a[opStr] ? a[opStr]() : original(a))
}
`;

exports.ooAddToBody = (new Parser({ ecmaVersion: 123123123123 }, ooFuncCode)).parse();

exports.ooVisitors = {
    BinaryExpression(node) {
        const left = node.left;
        const right = node.right;
        const operator = node.operator;
        const opLiteral = {
            type: "Literal",
            value: operator,
            raw: '"' + operator + '"'
        }

        if (!overloadables.includes(operator)) return;

        const newCall = {
            "type": "CallExpression",
            "callee": {
                "type": "Identifier",
                "name": "__binOp"
            },
            "arguments": [
                left,
                right,
                opLiteral,
                {
                    "type": "ArrowFunctionExpression",
                    "id": null,
                    "expression": true,
                    "generator": false,
                    "async": false,
                    "params": [
                        {
                            "type": "Identifier",
                            "name": "a"
                        },
                        {
                            "type": "Identifier",
                            "name": "b"
                        }
                    ], // HAVE A AND B BE IN HERE
                    "body": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        operator,
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ],
            "optional": false
        };

        Object.assign(node, newCall);
    },

    UnaryExpression(node) {
        const argument = node.argument;
        const operator = node.operator;
        const fixed = ["+", "-"].includes(operator) ? "u" + operator : operator;
        const opLiteral = {
            type: "Literal",
            value: fixed,
            raw: '"' + fixed + '"'
        }

        if (!overloadables.includes(operator)) return;

        const newCall = {
            "type": "CallExpression",
            "callee": {
                "type": "Identifier",
                "name": "__unOp"
            },
            "arguments": [
                argument,
                opLiteral,
                {
                    "type": "ArrowFunctionExpression",
                    "id": null,
                    "expression": true,
                    "generator": false,
                    "async": false,
                    "params": [
                        {
                            "type": "Identifier",
                            "name": "a"
                        }
                    ],
                    "body": {
                        "type": "UnaryExpression",
                        "argument": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        operator
                    }
                }
            ],
            "optional": false
        };

        Object.assign(node, newCall);
    },

    UpdateExpression(node) {
        const original = Object.assign({}, node);
        const argument = node.argument;
        const operator = node.operator;
        const opLiteral = {
            type: "Literal",
            value: operator,
            raw: '"' + operator + '"'
        }

        if (!overloadables.includes(operator)) return;

        const memExp = {
            "type": "MemberExpression",
            "object": argument,
            "property": opLiteral,
            "computed": true,
            "optional": false
        }

        const newCond = {
            "type": "ConditionalExpression",
            "test": memExp,
            "consequent": {
                "type": "CallExpression",
                "callee": memExp,
                "arguments": [],
                "optional": false
            },
            "alternate": original
        }

        Object.assign(node, newCond);
    },

    AssignmentExpression(node) {
        //funny caveat:
        // we cant do this (or UpdateExpression) with a function (no pass by reference)
        // meaning the left and right variables will be copied at least once
        // thats fine because you cant do something like 'new Number(3) += 2;'
        // as acorn automatically dies at the sight of this

        const original = Object.assign({}, node);
        const left = node.left;
        const right = node.right;
        const operator = node.operator;
        const opLiteral = {
            type: "Literal",
            value: operator,
            raw: '"' + operator + '"'
        }
        const operator2 = operator.slice(0,-1);
        const opLiteral2 = {
            type: "Literal",
            value: operator2,
            raw: '"' + operator2 + '"'
        }

        if (!overloadables.includes(operator)) return;

        const memExp = {
            "type": "MemberExpression",
            "object": left,
            "property": opLiteral,
            "computed": true,
            "optional": false
        }
        const memExp2 = Object.assign({}, memExp);
        memExp2.property = opLiteral2;

        const newCond = {
            "type": "ConditionalExpression",
            "test": memExp,
            "consequent": {
                "type": "CallExpression",
                "callee": memExp,
                "arguments": [
                    right
                ],
                "optional": false
            },
            "alternate": {
                type: "ConditionalExpression",
                test: memExp2,
                consequent: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left,
                    right: {
                        type: "CallExpression",
                        callee: memExp2,
                        arguments: [right],
                        optional: false
                    }
                },
                alternate: original
            }
        }
        //TODO: right side gets initialized twice
        Object.assign(node, newCond);
    }
}
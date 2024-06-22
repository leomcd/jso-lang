const { Parser } = require("../acornMod.js");

const overloadables = [
    "+", "-",
    "!", "~",
    "||", "&&",
    "|", "^", "&",
    "==", "!=", "===", "!==",
    "<", ">", "<=", ">=",
    "<<", ">>", ">>>",
    "++", "--",
    "%", "*", "**", "/",
    "+=", "-=", "/=", "*=", //TODO: add more of assignmentoperators
    //TODO: if += isnt defined, it just does a = a + ... if + is defined
]

const ooFuncCode = `
function __binOp(a, b, opStr, original) {
    return (a[opStr] ? a[opStr](b) : b[opStr] ? b[opStr](a) : original(a, b))
}
function __unOp(a, opStr, original) {
    return (a[opStr] ? a[opStr]() : original(a))
}
function __updateOp(a, opStr, original) {
    (a[opStr] ? a[opStr]() : original(a));
    return a;
}
function __assignOp(a, b, opStr, original) {
    (a[opStr] ? a[opStr](b) : original(a, b));
    return a;
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
        const argument = node.argument;
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
                "name": "__updateOp"
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
                        "type": "UpdateExpression",
                        "argument": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        operator,
                        left: false
                    }
                }
            ],
            "optional": false
        };

        Object.assign(node, newCall);
    },

    AssignmentExpression(node) {
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
                "name": "__assignOp"
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
                        "type": "AssignmentExpression",
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
    }
}
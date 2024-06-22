const { Parser } = require("../acornMod.js");

const tcFuncCode = `function __typeCheck(o, types, names) {
    for (const i in types) {
        const type = types[i];
        const name = names[i];

        if (type instanceof Function)
            {
                if (['Boolean', 'BigInt', 'Symbol', 'Function', 'String', 'Number'].includes(name) &&
                (o instanceof type || typeof o === name.toLowerCase()))
                    return;

                else if (o instanceof type)
                    return;
            }
        else
            if (o === type) return;
    }
    throw new Error("no");
}`

function apply(node) {
    for (const param of node.params) {
        const typeIdens = param.typeIdens;
        if (!typeIdens) continue;

        const left = param;
        const right = {
            type: "ArrayExpression",
            elements: typeIdens
        }
        const rightLiteral = {type: "ArrayExpression", elements: []};
        for (const iden of typeIdens) {
            if (iden.type === "Identifier")
                rightLiteral.elements.push({
                    type: "Literal",
                    value: iden.name,
                    raw: '"' + iden.name + '"'
                })
            else rightLiteral.elements.push({
                type: "Identifier",
                name: "undefined"
            });
        }

        //TODO: consider what happens if the body is not a BlockStatement
        node.body.body.unshift(
            {
                type: "ExpressionStatement",
                expression: {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": "__typeCheck"
                    },
                    "arguments": [
                        left,
                        right,
                        rightLiteral
                    ],
                    "optional": false
                }
            }
        );

        delete param.typeIden;
    }
}

exports.tcVisitors = {
    FunctionDeclaration(node) {
        apply(node);
    },
    FunctionExpression(node) {
        apply(node);
    },
    ArrowFunctionExpression(node) {
        apply(node);
    }
}

exports.tcAddToBody = (new Parser({ecmaVersion: 132123123}, tcFuncCode)).parse();
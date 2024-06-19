const acorn = require("../acornMod.js");
const { Parser } = require("../acornMod.js");

const p = new Parser();

const overloadables = [
    "+", "-",
    "!", "~",
    "||", "&&",
    "|", "^", "&",
    "==", "!=", "===", "!==",
    "<", ">", "<=", ">=",
    "<<", ">>", ">>>",
    "++", "--",
    "%", "*", "**", "/"
]

exports.ooVisitors = {
    BinaryExpression(node) {
        const original = Object.assign(new acorn.Node(p), node);

        const left = node.left;
        const right = node.right;
        const operator = node.operator;

        if (!overloadables.includes(operator)) return;

        const opAccLiteral = new acorn.Node(p);
        opAccLiteral.type = "Literal";
        opAccLiteral.value = operator;
        opAccLiteral.raw = '"' + opAccLiteral.value + '"';

        const mem1 = new acorn.Node(p); //a["OPERATOR"]
        mem1.type = "MemberExpression";
        mem1.object = left;
        mem1.property = opAccLiteral;
        mem1.computed = true;
        mem1.optional = false;

        const call1 = new acorn.Node(p); //a["OPERATOR"](b)
        call1.type = "CallExpression";
        call1.callee = mem1;
        call1.arguments = [right];
        call1.optional = false;

        const mem2 = new acorn.Node(p); //b["OPERATOR"]
        mem2.type = "MemberExpression";
        mem2.object = right;
        mem2.property = opAccLiteral;
        mem2.computed = true;
        mem2.optional = false;

        const call2 = new acorn.Node(p); //b["OPERATOR"](a)
        call2.type = "CallExpression";
        call2.callee = mem2;
        call2.arguments = [left];
        call2.optional = false;

        const cond2 = new acorn.Node(p);
        cond2.type = "ConditionalExpression";
        cond2.test = mem2;
        cond2.consequent = call2;
        cond2.alternate = original;

        const newCond = new acorn.Node(p);
        newCond.type = "ConditionalExpression";
        newCond.test = mem1;
        newCond.consequent = call1;
        newCond.alternate = cond2;

        Object.assign(node, newCond);
    },

    UnaryExpression(node) {
        const original = Object.assign(new acorn.Node(p), node);

        const argument = node.argument;
        const operator = node.operator;

        const opAccLiteral = new acorn.Node(p);
        opAccLiteral.type = "Literal";
        opAccLiteral.value = "u" + operator;
        opAccLiteral.raw = '"' + opAccLiteral.value + '"';

        const mem = new acorn.Node(p); //a["OPERATOR"]
        mem.type = "MemberExpression";
        mem.object = argument;
        mem.property = opAccLiteral;
        mem.computed = true;
        mem.optional = false;

        const call = new acorn.Node(p); //a["OPERATOR"]()
        call.type = "CallExpression";
        call.callee = mem;
        call.arguments = [];
        call.optional = false;

        const newCond = new acorn.Node(p);
        newCond.type = "ConditionalExpression";
        newCond.test = mem;
        newCond.consequent = call;
        newCond.alternate = original;

        Object.assign(node, newCond);
    },

    UpdateExpression(node) {
        const original = Object.assign(new acorn.Node(p), node);

        const argument = node.argument;
        const operator = node.operator;

        const opAccLiteral = new acorn.Node(p);
        opAccLiteral.type = "Literal";
        opAccLiteral.value = operator;
        opAccLiteral.raw = '"' + opAccLiteral.value + '"';

        const mem = new acorn.Node(p); //a["OPERATOR"]
        mem.type = "MemberExpression";
        mem.object = argument;
        mem.property = opAccLiteral;
        mem.computed = true;
        mem.optional = false;

        const call = new acorn.Node(p); //a["OPERATOR"]()
        call.type = "CallExpression";
        call.callee = mem;
        call.arguments = [];
        call.optional = false;

        const newCond = new acorn.Node(p);
        newCond.type = "ConditionalExpression";
        newCond.test = mem;
        newCond.consequent = call;
        newCond.alternate = original;

        Object.assign(node, newCond);
    }
}
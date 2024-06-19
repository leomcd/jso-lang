// this file transpiles test.jso to test.js
// by using a modified acorn parser
// and hopefully a modified escodegen generation

// that what i woulda did https://stackoverflow.com/questions/20762338/how-would-i-extend-the-javascript-language-to-support-a-new-operator/20764137#20764137

const {ooVisitors} = require("./ast_manip/operator_overload.js");

const acorn = require("./acornMod.js");
const { Parser } = require("./acornMod.js");
const fs = require("fs");
const escodegen = require("escodegen");
const walk = require("acorn-walk");

const inCode = fs.readFileSync("./test.jso");

const tree = Parser.parse(inCode.toString());

//TODO: remove positions from parsing because it all gets messed up from transforming anyways

const p = new Parser();
function makeNode(o) {
    const newNode = new acorn.Node(p);
    Object.assign(newNode, o);
    return newNode;
}

console.log(tree.body[0].params);

const visitors = Object.assign({}, ooVisitors);
walk.simple(tree, visitors);

const outCode = escodegen.generate(tree);

fs.writeFileSync("./test.js", outCode);
eval(outCode);
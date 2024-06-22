// this file transpiles test.jso to test.js
// by using a modified acorn parser
// and hopefully a modified escodegen generation

// that what i woulda did https://stackoverflow.com/questions/20762338/how-would-i-extend-the-javascript-language-to-support-a-new-operator/20764137#20764137

const {ooVisitors, ooAddToBody} = require("./ast_manip/operator_overload.js");
const {tcVisitors, tcAddToBody} = require("./ast_manip/type_check.js");

const acorn = require("./acornMod.js");
const { Parser } = require("./acornMod.js");
const fs = require("fs");
const escodegen = require("escodegen");
const walk = require("acorn-walk");

const inCode = fs.readFileSync("./test.jso");

const parser = new Parser({ecmaVersion: 123123123}, inCode.toString());

const tree = parser.parse();

//TODO: remove positions from parsing because it all gets messed up from transforming anyways
//TODO: keep testing operator overloading and expecially the assignment kind

const visitors = Object.assign({}, ooVisitors, tcVisitors);
walk.simple(tree, visitors);

tree.body.unshift(ooAddToBody);
tree.body.unshift(tcAddToBody);

const outCode = escodegen.generate(tree);

fs.writeFileSync("./test.js", outCode);
eval(outCode);
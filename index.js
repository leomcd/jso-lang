// this file transpiles test.jso to test.js
// by using a modified acorn parser
// and hopefully a modified escodegen generation

// that what i woulda did https://stackoverflow.com/questions/20762338/how-would-i-extend-the-javascript-language-to-support-a-new-operator/20764137#20764137

const acorn = require("./acornMod.js");
const fs = require("fs");
const escodegen = require("escodegen");

const inCode = fs.readFileSync("./test.jso");

const res = acorn.tokenizer(inCode.toString()).getToken();
console.log(res);
//const outCode = escodegen.generate(res);

//fs.writeFileSync("./test.js", outCode);

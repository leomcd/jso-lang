const { Parser } = require("acorn");
const fs = require("fs");
const escodegen = require("escodegen");

// horrible method for defining a new keyword (i used it):
// https://stackoverflow.com/questions/59804600/how-to-add-keyword-to-acorn-or-esprima-parser

// TODO: literally fork acornjs unbelievable

const tt = acorn.tokTypes; //used to access standard token types like "("
const TokenType = acorn.TokenType; //used to create new types of Tokens.

//add a new keyword to Acorn.
Parser.acorn.keywordTypes["operator"] = new TokenType("operator",{keyword: "operator"});

//const isIdentifierStart = acorn.isIdentifierStart;

function wordsRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
}

class JSOParser extends Parser {
    parse(...args) {
        const newKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super";
        newKeywords += " operator";
        this.keywords = wordsRegexp(newKeywords);

        return(super.parse(...args));
    }

    parseStatement(context, topLevel, exports) {
        if (this.type == Parser.acorn.keywordTypes["operator"]) {
            console.log("Parsing operator");
            let node = this.startNode();
            return this.parseOperator(node);
        }
        else {
            return(super.parseStatement(context, topLevel, exports));
        }
    }
}

const inCode = fs.readFileSync("./test.jso");

const res = JSOParser.parse(inCode);

const outCode = escodegen.generate(res);

fs.writeFileSync("./test.js", outCode);

const opStr = ">=";

const opposite = (opStr[0] === "<" ? ">" : "<") + (opStr[1] === "=" ? "" : "=");

console.log(opposite);
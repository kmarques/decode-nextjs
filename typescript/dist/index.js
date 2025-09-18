"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Hello World from TypeScript!");
const operators = ["+", "-", "*", "/"];
const leftOperand = 10;
const rightOperand = "100";
function cal0(leftOperand, operator, rightOperand) {
    return leftOperand + rightOperand;
}
function calc(operation) {
    const leftOperand = typeof operation.leftOperand === "number"
        ? operation.leftOperand
        : calc(operation.leftOperand);
    const rightOperand = typeof operation.rightOperand === "number"
        ? operation.rightOperand
        : calc(operation.rightOperand);
    switch (operation.operator) {
        case "+":
            return leftOperand + rightOperand;
        case "-":
            return leftOperand - rightOperand;
        case "*":
            return leftOperand * rightOperand;
        case "/":
            return leftOperand / rightOperand;
    }
}
let result = calc({
    leftOperand: {
        leftOperand: 1,
        operator: "+",
        rightOperand: 2,
    },
    operator: "*",
    rightOperand: {
        leftOperand: 1,
        operator: "/",
        rightOperand: 5,
    },
});
// result = calc({
//   leftOperand: 10,
//   operator: "%",
//   rightOperand: 100,
// });
console.log(result);
//# sourceMappingURL=index.js.map
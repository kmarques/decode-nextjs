console.log("Hello World from TypeScript!");

type ArithmeticOperator = "+" | "-" | "*" | "/";

const operators = ["+", "-", "*", "/"];

const leftOperand: number = 10;

const rightOperand: string = "100";

function cal0(leftOperand: number, operator: "+", rightOperand: number) {
  return leftOperand + rightOperand;
}

type CalcResult = number;
type CalcOperand = number;

type CalcOperation = {
  leftOperand: CalcOperationOrNumber;
  operator: ArithmeticOperator;
  rightOperand: CalcOperationOrNumber;
};

type CalcOperationOrNumber = CalcOperation | number;

function calc(
  operation: CalcOperation[] | CalcOperation
): CalcResult | CalcResult[] {
  const isArray = Array.isArray(operation);
  const operations = isArray ? operation : [operation];
  if (isArray && operation.length === 0)
    throw new RangeError("operation list is empty");

  function calcOne(operation: CalcOperation): number {
    const leftOperand =
      typeof operation.leftOperand === "number"
        ? operation.leftOperand
        : calcOne(operation.leftOperand);

    const rightOperand =
      typeof operation.rightOperand === "number"
        ? operation.rightOperand
        : calcOne(operation.rightOperand);

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

  const results = operations.map(calcOne);

  return isArray ? results : results[0];
}

let result: number | number[] = calc({
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

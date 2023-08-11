"use strict";

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }
  delete() {
    if (this.currentOperand === "Error") return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (
      (number === "." && this.currentOperand.includes(".")) ||
      this.currentOperand === "Error"
    )
      return;

    if (number === "±") {
      this.currentOperand = (-1 * this.currentOperand).toString();
    }

    if (
      number != "±" &&
      this.currentOperand.toString().includes("-") &&
      this.currentOperand.toString().includes(".") &&
      this.currentOperand.toString().length < 12
    )
      this.currentOperand = this.currentOperand.toString() + number.toString();

    if (
      number != "±" &&
      this.currentOperand.toString().includes("-") &&
      !this.currentOperand.toString().includes(".") &&
      this.currentOperand.toString().length < 11
    )
      this.currentOperand = this.currentOperand.toString() + number.toString();
    if (
      number != "±" &&
      !this.currentOperand.toString().includes("-") &&
      this.currentOperand.toString().includes(".") &&
      this.currentOperand.toString().length < 11
    )
      this.currentOperand = this.currentOperand.toString() + number.toString();

    if (
      number != "±" &&
      !this.currentOperand.toString().includes("-") &&
      !this.currentOperand.toString().includes(".") &&
      this.currentOperand.toString().length < 10
    )
      this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" || this.currentOperand === "Error") return;
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = 10 * parseFloat(this.previousOperand);
    const current = 10 * parseFloat(this.currentOperand);

    if (isNaN(prev)) return;

    if (this.operation === "+") {
      computation = (prev + current) / 10;
    }
    if (this.operation === "+" && isNaN(current)) {
      return;
    }

    if (this.operation === "-") {
      computation = (prev - current) / 10;
    }
    if (this.operation === "-" && isNaN(current)) {
      return;
    }

    if (this.operation === "*") {
      computation = (prev * current) / 100;
    }
    if (this.operation === "*" && isNaN(current)) {
      return;
    }
    if ((this.operation === "÷" && current === 0) || this.operation === "/") {
      computation = "Error";
    }

    if ((this.operation === "÷" && current != 0) || this.operation === "/") {
      computation = prev / current;
    }
    if (this.operation === "÷" && isNaN(current)) {
      return;
    }

    if (this.operation === "x²" || this.operation === "^") {
      computation = prev ** 2 / 100;
    }
    if (this.operation === "x³") {
      computation = prev ** 3 / 1000;
    }

    if (this.operation === "√" && prev < 0) {
      computation = "Error";
    }
    if (this.operation === "√" && prev >= 0) {
      computation = Math.sqrt(prev / 10);
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  getDisplayNumber(number) {
    let stringNumber = number.toString();

    if (
      stringNumber.includes("-") &&
      stringNumber.includes(".") &&
      stringNumber.length > 12
    ) {
      stringNumber = stringNumber.slice(0, 12);
    }
    if (
      stringNumber.includes("-") &&
      !stringNumber.includes(".") &&
      stringNumber.length > 11
    ) {
      stringNumber = stringNumber.slice(0, 11);
    }
    if (
      !stringNumber.includes("-") &&
      stringNumber.includes(".") &&
      stringNumber.length > 11
    ) {
      stringNumber = stringNumber.slice(0, 11);
    }
    if (
      !stringNumber.includes("-") &&
      !stringNumber.includes(".") &&
      stringNumber.length > 10
    ) {
      stringNumber = stringNumber.slice(0, 10);
    }

    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (
      decimalDigits != null &&
      integerDisplay.length + decimalDigits.length < 14
    ) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    if (this.currentOperand === "Error") {
      this.currentOperandTextElement.innerText = this.currentOperand;
    }

    if (this.currentOperand != "Error")
      this.currentOperandTextElement.innerText = this.getDisplayNumber(
        this.currentOperand
      );

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});
equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

document.addEventListener("keypress", function (e) {
  if (
    e.key == "0" ||
    e.key == "1" ||
    e.key == "2" ||
    e.key == "3" ||
    e.key == "4" ||
    e.key == "5" ||
    e.key == "6" ||
    e.key == "7" ||
    e.key == "8" ||
    e.key == "9" ||
    e.key == "."
  ) {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
  }
  if (
    e.key == "+" ||
    e.key == "-" ||
    e.key == "*" ||
    e.key == "/" ||
    e.key == "^"
  ) {
    calculator.chooseOperation(e.key);
    calculator.updateDisplay();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    calculator.delete();
    calculator.updateDisplay();
  }
  if (e.key === "Delete") {
    calculator.clear();
    calculator.updateDisplay();
  }
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    calculator.compute();
    calculator.updateDisplay();
  }
});

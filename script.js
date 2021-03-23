/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.equation = '';
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    let equation = '';
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        equation = `${prev} + ${current} = ${computation}`;
        break;
      case '-':
        computation = prev - current;
        equation = `${prev} - ${current} = ${computation}`;
        break;
      case '*':
        computation = prev * current;
        equation = `${prev} * ${current} = ${computation}`;
        break;
      case '÷':
        computation = prev / current;
        equation = `${prev} / ${current} = ${computation}`;
        break;
      default:
        return;
    }
    console.log(equation);
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
    this.equation = equation;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    }
    return integerDisplay;
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const clearButton = document.getElementById('clear');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// If clear button pressed, clear database for new entries
clearButton.addEventListener('click', (button) => {
  clearCalcs();
});

// Number pressed, log numbers and update display
numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

// Go through all buttons and check which operation button pressed for display
operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

// Equals button pressed -> compute equation and write equation to db
equalsButton.addEventListener('click', (button) => {
  calculator.compute();
  calculator.updateDisplay();
  writeEquation(calculator.equation);
});

// Clears the calculator display
allClearButton.addEventListener('click', (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

// Deletes single character from the display
deleteButton.addEventListener('click', (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

let display;
let currentExpression = '';
let lastWasResult = false;
const OPERATORS = '+-*/%';

function updateDisplay() {
    if (!display) {
        display = document.getElementById('display');
    }
    if (!display) return;
    display.textContent = currentExpression === '' ? '0' : currentExpression.replace(/\./g, ',');
}

function appendNumber(number) {
    if (lastWasResult) {
        currentExpression = '';
        lastWasResult = false;
    }
    if (number === ',') number = '.';
    currentExpression += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (!currentExpression) {
        if (operator === '-') {
            currentExpression = operator;
            updateDisplay();
        }
        return;
    }

    if (lastWasResult) {
        lastWasResult = false;
    }

    const lastChar = currentExpression.slice(-1);
    if (OPERATORS.includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else {
        currentExpression += operator;
    }
    updateDisplay();
}

function clearDisplay() {
    currentExpression = '';
    lastWasResult = false;
    updateDisplay();
}

function calculate() {
    if (!currentExpression) return;

    let expression = currentExpression.replace(/,/g, '.');

    while (OPERATORS.includes(expression.slice(-1))) {
        expression = expression.slice(0, -1);
    }

    if (!expression) {
        currentExpression = '';
        updateDisplay();
        return;
    }

    try {
        const result = Function(`"use strict"; return (${expression})`)();
        if (!Number.isFinite(result)) throw new Error();
        currentExpression = String(result);
        lastWasResult = true;
        updateDisplay();
    } catch (error) {
        currentExpression = '';
        lastWasResult = false;
        if (display) display.textContent = 'Erro';
    }
}

function handleKey(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
        return;
    }

    if (key === ',' || key === '.') {
        appendNumber(',');
        return;
    }

    if (OPERATORS.includes(key)) {
        appendOperator(key);
        return;
    }

    if (key === 'Enter' || key === '=') {
        calculate();
        return;
    }

    if (key === 'C' || key === 'c' || key === 'Backspace' || key === 'Escape') {
        clearDisplay();
    }
}

window.addEventListener('keydown', handleKey);
window.addEventListener('DOMContentLoaded', updateDisplay);
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const keys = document.querySelectorAll(".key");

let expression = "";
let lastResult = "0";
let justCalculated = false;

function render() {
    expressionEl.textContent = expression;
    resultEl.textContent = lastResult;
}

function isOperator(char) {
    return ["+", "-", "*", "/"].includes(char);
}

function normalizeExpression(value) {
    return value.replace(/[^0-9+\-*/().]/g, "");
}

function appendValue(value) {
    if (justCalculated && /[0-9.(]/.test(value)) {
        expression = "";
        justCalculated = false;
    }

    const lastChar = expression.slice(-1);

    if (isOperator(value) && isOperator(lastChar)) {
        expression = expression.slice(0, -1) + value;
    } else if (value === ".") {
        const segment = expression.split(/[-+*/()]/).pop();
        if (!segment.includes(".")) {
            expression += value;
        }
    } else if (value === "(") {
        expression += value;
    } else if (value === ")") {
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;
        if (openCount > closeCount && expression && !isOperator(lastChar) && lastChar !== "(") {
            expression += value;
        }
    } else {
        expression += value;
    }

    justCalculated = false;

    render();
}

function clearAll() {
    expression = "";
    lastResult = "0";
    justCalculated = false;
    render();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    render();
}

function calculate() {
    if (!expression.trim()) {
        return;
    }

    const sanitized = normalizeExpression(expression);

    try {
        const value = Function(`"use strict"; return (${sanitized});`)();
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error("Invalid result");
        }

        lastResult = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(8)));
        expression = lastResult;
        justCalculated = true;
        render();
    } catch {
        lastResult = "Error";
        justCalculated = false;
        render();
    }
}

keys.forEach((key) => {
    key.addEventListener("click", () => {
        const { action, value } = key.dataset;

        if (value) {
            appendValue(value);
            return;
        }

        if (action === "clear") {
            clearAll();
        } else if (action === "delete") {
            deleteLast();
        } else if (action === "equals") {
            calculate();
        }
    });
});

document.addEventListener("keydown", (event) => {
    const { key } = event;

    if (/^[0-9]$/.test(key) || [".", "+", "-", "*", "/", "(", ")"].includes(key)) {
        appendValue(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape") {
        clearAll();
    }
});

render();
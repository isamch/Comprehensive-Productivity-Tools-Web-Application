import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (nextOperation: string) => {
    if (nextOperation === '=') {
      performOperation(nextOperation);
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    } else {
      performOperation(nextOperation);
    }
  };

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-500 hover:bg-red-600 text-white col-span-2' },
    { label: '⌫', action: backspace, className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { label: '/', action: () => handleOperation('/'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '7', action: () => inputNumber('7'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '*', action: () => handleOperation('*'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '4', action: () => inputNumber('4'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '-', action: () => handleOperation('-'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '1', action: () => inputNumber('1'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '+', action: () => handleOperation('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '0', action: () => inputNumber('0'), className: 'bg-gray-200 hover:bg-gray-300 col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '=', action: () => handleOperation('='), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
  ];

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="bg-gray-900 text-white p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
          <div className="text-right">
            {operation && previousValue !== null && (
              <div className="text-gray-400 text-xs sm:text-sm">
                {previousValue} {operation}
              </div>
            )}
            <div className="text-2xl sm:text-4xl font-mono font-bold truncate">
              {display}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`h-12 sm:h-16 rounded-lg font-semibold text-sm sm:text-lg transition-all duration-200 active:scale-95 ${button.className}`}
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm">
          <p>Simple Calculator</p>
          <p>Supports basic arithmetic operations</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
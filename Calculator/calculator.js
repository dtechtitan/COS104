        let display = document.getElementById('display');
        let currentInput = '';
        let operator = '';
        let previousInput = '';
        let waitingForNewInput = false;

        function appendNumber(number) {
            if (waitingForNewInput) {
                display.value = '';
                waitingForNewInput = false;
            }
            
            if (number === '.' && display.value.includes('.')) {
                return;
            }
            
            if (display.value === '0' && number !== '.') {
                display.value = number;
            } else {
                display.value += number;
            }
            
            // Add subtle animation
            display.classList.add('success');
            setTimeout(() => display.classList.remove('success'), 200);
        }

        function appendOperator(op) {
            if (previousInput !== '' && operator !== '' && !waitingForNewInput) {
                calculate();
            }
            
            previousInput = display.value;
            operator = op;
            waitingForNewInput = true;
            
            // Show operator in display temporarily
            display.value += ' ' + getOperatorSymbol(op) + ' ';
            
            setTimeout(() => {
                display.value = previousInput;
            }, 500);
        }

        function getOperatorSymbol(op) {
            switch(op) {
                case '+': return '+';
                case '-': return '−';
                case '*': return '×';
                case '/': return '÷';
                case '**': return '^';
                case '%': return '%';
                default: return op;
            }
        }

        function calculate() {
            if (previousInput === '' || operator === '') {
                return;
            }
            
            currentInput = display.value;
            let result;
            
            try {
                const prev = parseFloat(previousInput);
                const current = parseFloat(currentInput);
                
                if (isNaN(prev) || isNaN(current)) {
                    throw new Error('Invalid input');
                }
                
                switch(operator) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '*':
                        result = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            throw new Error('Cannot divide by zero');
                        }
                        result = prev / current;
                        break;
                    case '**':
                        result = Math.pow(prev, current);
                        break;
                    case '%':
                        result = prev % current;
                        break;
                    default:
                        throw new Error('Unknown operator');
                }
                
                // Handle very large or very small numbers
                if (!isFinite(result)) {
                    throw new Error('Result is too large');
                }
                
                // Round to prevent floating point errors
                result = Math.round(result * 1000000000) / 1000000000;
                
                display.value = result.toString();
                display.classList.add('success');
                setTimeout(() => display.classList.remove('success'), 500);
                
            } catch (error) {
                display.value = 'Error';
                display.classList.add('error');
                setTimeout(() => {
                    display.classList.remove('error');
                    clearAll();
                }, 1500);
                return;
            }
            
            previousInput = '';
            operator = '';
            waitingForNewInput = true;
        }

        function clearAll() {
            display.value = '0';
            currentInput = '';
            operator = '';
            previousInput = '';
            waitingForNewInput = false;
        }

        function clearEntry() {
            display.value = '0';
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if ('0123456789.'.includes(key)) {
                appendNumber(key);
            } else if ('+-*/'.includes(key)) {
                appendOperator(key);
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape') {
                clearAll();
            } else if (key === 'Backspace') {
                if (display.value.length > 1) {
                    display.value = display.value.slice(0, -1);
                } else {
                    display.value = '0';
                }
            } else if (key === '%') {
                appendOperator('%');
            } else if (key === '^') {
                appendOperator('**');
            }
        });

        // Initialize display
        clearAll();
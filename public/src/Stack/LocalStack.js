export default class LocalStacks {
    constructor() {
        this.stacks = {}; // Object to hold the stacks
    }

    // Add element to a specific stack
    push(stackName, element) {
        if (!this.stacks[stackName]) {
            this.stacks[stackName] = []; // Create a new stack if it doesn't exist
        }
        this.stacks[stackName].push(element);
    }

    // Remove and return the top element from a specific stack
    pop(stackName) {
        if (!this.stacks[stackName] || this.stacks[stackName].length === 0) {
            return null; // Stack is empty or doesn't exist
        }
        return this.stacks[stackName].pop();
    }

    // Return the top element of a specific stack without removing it
    peek(stackName) {
        if (!this.stacks[stackName] || this.stacks[stackName].length === 0) {
            return null; // Stack is empty or doesn't exist
        }
        return this.stacks[stackName][this.stacks[stackName].length - 1];
    }

    // Check if a specific stack is empty
    isEmpty(stackName) {
        return !this.stacks[stackName] || this.stacks[stackName].length === 0;
    }

    // Get the size of a specific stack
    size(stackName) {
        if (!this.stacks[stackName]) {
            return 0; // Stack doesn't exist
        }
        return this.stacks[stackName].length;
    }

    // Clear a specific stack
    clear(stackName) {
        if (!this.stacks[stackName])
            return 0;

        return this.stacks[stackName] = [];
    }
}

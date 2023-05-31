class LocalStacks {
    constructor() {
        LocalStacks.stacks = {}; // Object to hold the stacks
    }
    // Add element to a specific stack
    push(stackName, element) {
        if (!LocalStacks.stacks[stackName]) {
            LocalStacks.stacks[stackName] = []; // Create a new stack if it doesn't exist
        }
        LocalStacks.stacks[stackName].push(element);
    }
    // Remove and return the top element from a specific stack
    pop(stackName) {
        if (!LocalStacks.stacks[stackName] || LocalStacks.stacks[stackName].length === 0) {
            return null; // Stack is empty or doesn't exist
        }
        return LocalStacks.stacks[stackName].pop();
    }
    // Return the top element of a specific stack without removing it
    peek(stackName) {
        if (!LocalStacks.stacks[stackName] || LocalStacks.stacks[stackName].length === 0) {
            return null; // Stack is empty or doesn't exist
        }
        return LocalStacks.stacks[stackName][LocalStacks.stacks[stackName].length - 1];
    }
    // Check if a specific stack is empty
    isEmpty(stackName) {
        return !LocalStacks.stacks[stackName] || LocalStacks.stacks[stackName].length === 0;
    }
    // Get the size of a specific stack
    size(stackName) {
        if (!LocalStacks.stacks[stackName]) {
            return 0; // Stack doesn't exist
        }
        return LocalStacks.stacks[stackName].length;
    }
}
LocalStacks.stacks = {};
export default LocalStacks;

class GlobalStacks {
    constructor() {
        // If stacks object does not exist, it will be created
        if (!GlobalStacks.stacks) {
            GlobalStacks.stacks = {};
        }
        // Class variable stacks will be overwritten with stacks from GlobalStacks
        // this.stacks = GlobalStacks.stacks; // Remove this line
        // Setting class to the global window
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.GlobalStacks = this;
    }
    // Add element to a specific stack
    push(stackName, element) {
        if (!GlobalStacks.stacks[stackName]) {
            GlobalStacks.stacks[stackName] = []; // Create a new stack if it doesn't exist
        }
        GlobalStacks.stacks[stackName].push(element);
    }
    // Remove and return the top element from a specific stack
    pop(stackName) {
        if (!GlobalStacks.stacks[stackName] || GlobalStacks.stacks[stackName].length === 0) {
            return null; // Stack is empty or doesn't exist
        }
        return GlobalStacks.stacks[stackName].pop();
    }
    // Return the top element of a specific stack without removing it
    peek(stackName) {
        if (!GlobalStacks.stacks[stackName] || GlobalStacks.stacks[stackName].length === 0) {
            return null; // Stack is empty or doesn't exist
        }
        return GlobalStacks.stacks[stackName][GlobalStacks.stacks[stackName].length - 1];
    }
    // Check if a specific stack is empty
    isEmpty(stackName) {
        return !GlobalStacks.stacks[stackName] || GlobalStacks.stacks[stackName].length === 0;
    }
    // Get the size of a specific stack
    size(stackName) {
        if (!GlobalStacks.stacks[stackName]) {
            return 0; // Stack doesn't exist
        }
        return GlobalStacks.stacks[stackName].length;
    }
}
GlobalStacks.stacks = {};
export default GlobalStacks;

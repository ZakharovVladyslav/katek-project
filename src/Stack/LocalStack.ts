interface Stack {
    [key: string]: Array<string | number | boolean>;
}

interface LocalStacksInterface {
	push(stackName: string, element: string | number | boolean): void;
	pop(stackName: string): string | number | boolean | null;
	peek(stackName: string): string | number | boolean | null;
	isEmpty(stackName: string): boolean;
	size(stackName: string): number;
	clear(stackName: string): void;
}

export default class LocalStacks {
	private static stacks: Stack = {};

	constructor() {
		LocalStacks.stacks = {}; // Object to hold the stacks
	}

	// Add element to a specific stack
	push(stackName: string, element: string | number | boolean) {
		if (!LocalStacks.stacks[stackName]) {
			LocalStacks.stacks[stackName] = []; // Create a new stack if it doesn't exist
		}
		LocalStacks.stacks[stackName].push(element);
	}

	// Remove and return the top element from a specific stack
	pop(stackName: string) {
		if (!LocalStacks.stacks[stackName] || LocalStacks.stacks[stackName].length === 0) {
			return null; // Stack is empty or doesn't exist
		}
		return LocalStacks.stacks[stackName].pop();
	}

	// Return the top element of a specific stack without removing it
	peek(stackName: string) {
		if (!LocalStacks.stacks[stackName] || LocalStacks.stacks[stackName].length === 0) {
			return null; // Stack is empty or doesn't exist
		}
		return LocalStacks.stacks[stackName][LocalStacks.stacks[stackName].length - 1];
	}

	// Check if a specific stack is empty
	isEmpty(stackName: string) {
		return !LocalStacks.stacks[stackName] || LocalStacks.stacks[stackName].length === 0;
	}

	// Get the size of a specific stack
	size(stackName: string) {
		if (!LocalStacks.stacks[stackName]) {
			return 0; // Stack doesn't exist
		}
		return LocalStacks.stacks[stackName].length;
	}

	// Clear a specific stack
	clear(stackName: string) {
		if (!LocalStacks.stacks[stackName])
			return 0;

		return LocalStacks.stacks[stackName] = [];
	}
}

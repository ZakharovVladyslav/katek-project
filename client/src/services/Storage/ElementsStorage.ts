class HTMLElementsStorage {
    private static storage: Record<string, any> = {};
	private storage: Record<string, any>;

    constructor() {
        if (!HTMLElementsStorage.storage)
            HTMLElementsStorage.storage = {};

        this.storage = HTMLElementsStorage.storage;
        (window as any).HTMLElementsStorage = this;
    }
}

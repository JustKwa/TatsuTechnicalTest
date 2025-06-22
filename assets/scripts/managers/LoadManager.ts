class LoadManager {
  private subscribers: Map<string, Function> = new Map();
  private checkers: Map<string, boolean> = new Map();
  private isLoadComplete: boolean = false;

  private constructor() {}

  private static instance: LoadManager;

  static getInstance(): LoadManager {
    if (!LoadManager.instance) {
      LoadManager.instance = new LoadManager();
    }
    return LoadManager.instance;
  }

  subscribe(id: string, callback: Function): void {
    this.subscribers.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  registerChecker(): string {
    const randomId = Math.random().toString(36).substring(2, 15);
    this.checkers.set(randomId, false);
    return randomId;
  }

  completeChecker(checkerId: string): void {
    if (!this.checkers.has(checkerId)) {
      return;
    }
    this.checkers.set(checkerId, true);
    this.checkLoadCompletion();
  }

  private checkLoadCompletion(): void {
    if (this.isLoadComplete) {
      return;
    }

    const allCheckersComplete = Array.from(this.checkers.values()).every(
      (status) => status === true,
    );

    if (allCheckersComplete) {
      this.isLoadComplete = true;
      this.invokeSubscribers();
    }
  }

  private invokeSubscribers(): void {
    this.subscribers.forEach((callback) => callback());
  }

  forceCompleteLoad(): void {
    this.isLoadComplete = true;
    this.invokeSubscribers();
  }

  reset(): void {
    this.subscribers.clear();
    this.checkers.clear();
    this.isLoadComplete = false;
  }
}

const loadManager = LoadManager.getInstance();
export default loadManager;

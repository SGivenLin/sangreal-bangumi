class SearchHistory {
    private readonly storageKey: string;
    private readonly maxEntries: number;
  
    constructor(storageKey: string, maxEntries: number = 6) {
      this.storageKey = storageKey;
      this.maxEntries = maxEntries;
    }
  
    public addEntry(entry: string): void {
      const history = this.getHistory();
      if (history.includes(entry)) {
        history.splice(history.indexOf(entry), 1);
      }

      history.unshift(entry); // Add the new entry at the beginning of the array
  
      if (history.length > this.maxEntries) {
        history.pop(); // Remove the oldest entry if the maximum number of entries is exceeded
      }
  
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    }
  
    public getHistory(): string[] {
      const storedHistory = localStorage.getItem(this.storageKey);
  
      if (storedHistory) {
        return JSON.parse(storedHistory);
      }
  
      return [];
    }
  }
  

export default SearchHistory
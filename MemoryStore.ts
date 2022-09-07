import IMemoryStore from "./types";

class MemoryStore implements IMemoryStore {
  public storage;

  constructor() {
    this.storage = {};
  }

  public increment = (key: string, expiry: number, callback: Function) => {
    if (!this.storage[key] || this.storage[key].expiry <= Date.now()) {
      this.storage[key] = {
        currentValue: 0,
        expiry: expiry,
      };
    }

    this.storage[key].currentValue++;
    callback(this.storage[key]);
  };
}

module.exports = MemoryStore;

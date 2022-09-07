import IStore from "./types";

class Store implements IStore {
  public storage: object;

  constructor() {
    this.storage = {};
  }

  public increment = (
    key: string,
    expirationDate: number,
    callback: Function
  ) => {
    if (!this.storage[key] || this.storage[key].expirationDate <= Date.now()) {
      this.storage[key] = {
        currentValue: 0,
        expirationDate: expirationDate,
      };
    }

    this.storage[key].currentValue++;
    callback(this.storage[key]);
  };
}

export default Store;

import Store from "../store/Store";

// For testing purpose expiration time is set on second instead of a one minute

describe("Testing store", () => {
  const key = "testing-key";
  const expirationDate = Date.now() + 1000;
  const newExpirationDate = Date.now() + 1000;
  const store = new Store();

  it("increment function should increase value by one every call", () => {
    store.increment(key, expirationDate, (limit) => {
      expect(limit.currentValue).toBe(1);
      expect(limit.expirationDate).toBe(expirationDate);
    });
    store.increment(key, newExpirationDate, (limit) => {
      expect(limit.currentValue).toBe(2);
      expect(limit.expirationDate).toBe(expirationDate);
    });
  });
  it("expiration date of limit should be replaced with current time plus one second, after due time", () => {
    store.increment(key, expirationDate, (limit) => {
      expect(limit.expirationDate).toBe(expirationDate);
    });
    setTimeout(() => {
      store.increment(key, newExpirationDate, (limit) => {
        expect(limit.currentValue).toBe(1);
        expect(limit.expirationDate).toBe(newExpirationDate);
      });
    }, 1500);
  });
});

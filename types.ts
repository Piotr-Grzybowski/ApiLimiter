export default interface IMemoryStore {
  storage: object;
  increment(key: string, expiry: number, callback: Function): void;
}

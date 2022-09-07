export default interface IStore {
  storage: object;
  increment(key: string, expiry: number, callback: Function): void;
}

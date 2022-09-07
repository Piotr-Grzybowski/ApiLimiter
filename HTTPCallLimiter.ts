const MemoryStore = require("./MemoryStore");
import IMemoryStore from "./types";

class HTTPCallLimiter {
  constructor(
    public callsPerMinute: number,
    public expiration: number = 60 * 1000,
    public store: IMemoryStore = new MemoryStore()
  ) {}

  get middleware() {
    return (req, res, next: Function) => {
      const expiry: number = Date.now() + this.expiration;
      const key: string = "limit-http-calls-for-" + req.url;

      console.log(key, expiry);
      this.store.increment(key, expiry, ({ currentValue, expiry }) => {
        if (currentValue > this.callsPerMinute) {
          const err = new customError("429", "Requests limit reached!");
          return next(err);
        }

        res.header("X-RateLimit-Remaining", this.callsPerMinute - currentValue);
        res.header("X-RateLimit-Limit", this.callsPerMinute);
        res.header("X-RateLimit-Reset", expiry);
        next();
      });
    };
  }
}

class customError extends Error {
  public status;
  constructor(status: string, ...error) {
    super(...error);
    status = status;
  }
}

module.exports = HTTPCallLimiter;

import Store from "./store/Store";
import IStore from "./store/types";
import { IncomingMessage, ServerResponse } from "http";
import { IError } from "./types";

export {};

class ApiCallLimiter {
  public store: IStore = new Store();

  constructor(
    public callsPerMinute: number,
    public expiration: number = 60 * 1000
  ) {}

  get middleware() {
    return (req: IncomingMessage, res: ServerResponse, next: Function) => {
      const expirationDate: number = Date.now() + this.expiration;
      const key: string = "limit-http-calls-for-" + req.url;

      this.store.increment(
        key,
        expirationDate,
        ({ currentValue, expirationDate }) => {
          if (currentValue > this.callsPerMinute) {
            res.statusCode = 429;
            res.end("Requests limit reached!");
            return;
          }

          res.setHeader(
            "X-RateLimit-Remaining",
            this.callsPerMinute - currentValue
          );
          res.setHeader("X-RateLimit-Limit", this.callsPerMinute);
          res.setHeader("X-RateLimit-Reset", expirationDate);
          next();
        }
      );
      next();
    };
  }
}

export default function limiter(callsPerMinute, expiration?) {
  return new ApiCallLimiter(callsPerMinute, expiration).middleware;
}

import Store from "./store/Store";
import IStore from "./store/types";
import { IncomingMessage, ServerResponse } from "http";
import { IError } from "./types";

class ApiCallLimiter {
  public expiration: number = 60 * 1000;
  public store: IStore = new Store();

  constructor(public callsPerMinute: number) {}

  middleware() {
    return (req: IncomingMessage, res: ServerResponse, next: Function) => {
      const expirationDate: number = Date.now() + this.expiration;
      const key: string = "limit-http-calls-for-" + req.url;

      this.store.increment(
        key,
        expirationDate,
        ({ currentValue, expirationDate }) => {
          if (currentValue > this.callsPerMinute) {
            const err: IError = new Error("Requests limit reached!");
            err.statusCode = "429";
            return next(err);
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
    };
  }
}

export default function limiter(callsPerMinute) {
  return new ApiCallLimiter(callsPerMinute).middleware;
}

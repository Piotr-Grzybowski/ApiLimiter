import { response } from "express";
import limiter from "../ApiCallLimiter";

import express, { Application } from "express";
import request from "supertest";

const app: Application = express();

describe("Testing ApiCallLimiter", () => {
  const limit = 5;
  app.get("/test", limiter(limit), (req, res) => {
    res.status(200).json({ test: "OK" });
  });

  it("should return proper headers when limit not reached", (done) => {
    const limit = 5;
    for (let i = 0; i <= limit; i++) {
      request(app)
        .get("/test")
        .then((response) => {
          expect(response.headers["Content-Type"]).toBe("json");
          expect(response.headers["X-RateLimit-Remaining"]).toBe(
            Math.floor(limit - i).toString()
          );
          expect(response.headers["X-RateLimit-Limit"]).toBe(limit.toString());
          expect(response.header).toBe(200);
        })
        .catch((err) => {
          throw err;
        });
    }
    done();
  });
  it("should return proper header and message when limit reached", (done) => {
    request(app)
      .get("/test")
      .then((response) => {
        expect(response.statusCode).toBe(429);
        expect(response.text).toBe("Requests limit reached!");
      });
    done();
  });
});

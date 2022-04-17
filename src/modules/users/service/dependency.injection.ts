import { redisConnection } from "./redis/redis.connection";
import { AuthService } from "./auth/auth.service";

const authService = new AuthService(redisConnection);

authService
  .countSessions("goodluck@gmail.com")
  .then((t) => console.log(t))
  .catch((err) => console.log(err));

// authService
//   .getTokens("alexader@gmail.com")
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .countTokens()
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .getToken(
//     "alexader@gmail.com",
//     "nDgrghV6IYyGNP3iKQyr9f3HS5sSIoerUlXh8WU0Hx3QY51bxvZrb5ZQolqyyYOV9f1I6DqMqZKHb7iIJ35FgFA67EDHUOypCE0wmbpa3aGyJF5MQR55EfTfspgmv8ZU3V6qr2y79bWI16H2cHNqguXGcPikJVN8r9SnNWnkoCQnuQ3LGdtiX295uILAwilznMSFWTZmAPFGz8fLS4H9MySeucnkg5qzdPG3ZMk2SKs6450NfrAPUQL79PePbao4"
//   )
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .decodeJWT(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJnUFBhUi1ueGo4NkdaaFhvS0hGR0giLCJlbWFpbCI6ImFsZXhhZGVyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYWxleGFuZGVyIiwiaXNFbWFpbFZlcmlmaWVkIjpmYWxzZSwiYWRtaW5Vc2VyIjpmYWxzZSwiaWF0IjoxNjQ5NjkzNTc4LCJleHAiOjE2NDk2OTM4Nzh9.LC_YC2O0BWRb_5wHLNINCfyr3qg4hpp2E05-zZGHzeQ"
//   )
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .deAuthenticateUser("goodluck@gmail.com")
//   .then((value) => console.log(value))
//   .catch((err) => console.log(err));

export { authService };

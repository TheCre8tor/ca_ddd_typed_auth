import { redisConnection } from "./redis/redis.connection";
import { AuthService } from "./auth/auth.service";
import log from "../../../shared/utils/logger";

const authService = new AuthService(redisConnection);

// authService
//   .countSessions("goodluck@gmail.com")
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .getTokens("goodluck@gmail.com")
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .countTokens()
//   .then((t) => console.log(t))
//   .catch((err) => console.log(err));

// authService
//   .getToken(
//     "goodluck@gmail.com",
//     "tZrBeO93MxZJadGozUd3wKuMqmsVGOCQqA4EQZgU6J67jRAMdfeqYSJjVFvT7T7ullsXqdOU1JRpq71CYOdNhtSrqgyVSMCeeAntJPLg9JpBBXnZ8cfAO6ZnOSQMVFZcb3o8tuBsENrF2kqJD7NiXglVojLG4EJ5TdDKIktzfBAq8Fs7PmZIsDUEVKY1jSeKdhf0j3ivEI4Yaf46hmFsu1l8K4Uy1F4YapFNaS3s1TN05DGX6NqeeKSnu3QmePiV"
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

// authService
//   .getUserEmailFromRefreshToken(
//     "9CkKAd5fqOoMjvHw8xQcqgpmKQfc4wlwqzmUuUiODTSQkJwvPMFv7tkLZd5TMLKQ98UW8LqMXd4SAVMVmJUkLJ6qgP6wNO0ZbfkmgIDcNIdxOHQBVAAWoNMHxQfAKf3ic8teUtyBcJD6vneG1lUACcwUPtrYyDMFWEzrJX3sZJKFbe8hdlxungxfjDeGk72llgI1KnuO7UqKCFT9ZM2Ou7lit0La3yRjDgUInw2awpJSEY7FALjsyef49GAmqecJ"
//   )
//   .then((value) => log.info(value))
//   .catch((err) => console.log(err));

// authService
//   .refreshTokenExists(
//     "9CkKAd5fqOoMjvHw8xQcqgpmKQfc4wlwqzmUuUiODTSQkJwvPMFv7tkLZd5TMLKQ98UW8LqMXd4SAVMVmJUkLJ6qgP6wNO0ZbfkmgIDcNIdxOHQBVAAWoNMHxQfAKf3ic8teUtyBcJD6vneG1lUACcwUPtrYyDMFWEzrJX3sZJKFbe8hdlxungxfjDeGk72llgI1KnuO7UqKCFT9ZM2Ou7lit0La3yRjDgUInw2awpJSEY7FALjsyef49GAmqecJ"
//   )
//   .then((value) => console.log(value))
//   .catch((err) => console.log(err));

export { authService };

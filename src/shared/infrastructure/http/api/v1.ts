import { Request, Response, Router } from "express";
import { userRouter } from "../../../../modules/users/infrastructure/http/routes/index.routes";

const v1Router = Router();

v1Router.get("/healthcheck", (req: Request, res: Response) => {
  return res.json({ message: "Yo! we're up and running!" });
});

v1Router.use("/users", userRouter);

export { v1Router };

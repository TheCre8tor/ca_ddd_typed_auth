import { authService } from "../../../../modules/users/service/dependency.injection";
import { RouteGuard } from "./routes.guard";

const routeGuard = new RouteGuard(authService);

export { routeGuard };

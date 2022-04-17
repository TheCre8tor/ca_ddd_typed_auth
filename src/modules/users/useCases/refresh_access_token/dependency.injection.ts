import { userRepository } from "../../repositories/dependency.injection";
import { authService } from "../../service/dependency.injection";
import { RefreshAccessTokenController } from "./refresh_access_token.controller";
import { RefreshAccessTokenUseCase } from "./refresh_access_token.usecase";

const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
  userRepository,
  authService
);

const refreshAccessTokenController = new RefreshAccessTokenController(
  refreshAccessTokenUseCase
);

export { refreshAccessTokenController };

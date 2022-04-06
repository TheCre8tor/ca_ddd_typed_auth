import { JWTToken, RefreshToken } from "../jwt";
import { UserEmail } from "../valueObjects/user_email";
import { UserName } from "../valueObjects/user_name";
import { UserPassword } from "../valueObjects/user_password";

interface UserProps {
  email: UserEmail;
  username: UserName;
  password: UserPassword;
  isEmailVerified?: boolean;
  isAdminUser?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  isDeleted?: boolean;
  lastLogin?: Date;
}

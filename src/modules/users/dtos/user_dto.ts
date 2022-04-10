export interface UserDTO {
  username: string;
  isEmailVerified?: boolean;
  isAdminUser?: boolean;
  isDeleted?: boolean;
}

export interface UserDTOLean {
  nano_id: string | number;
  email: string;
  username: string;
}

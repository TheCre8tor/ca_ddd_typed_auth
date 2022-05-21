import { UserDTO } from '../../users/dtos/user_dto';

export interface MemberDTO {
    reputation: number;
    user: UserDTO;
}

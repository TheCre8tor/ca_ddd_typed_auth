import { Result } from "../../../../shared/core/result";
import { UniqueEntityID } from "./../../../../shared/domain/utils/unique_entity_id";
import { Entity } from "./entity";

export class UserId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<UserId> {
    return Result.ok<UserId>(new UserId(id));
  }
}

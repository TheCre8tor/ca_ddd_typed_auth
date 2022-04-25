import { Result } from '../../../../shared/core/result';
import { Entity } from '../../../../shared/domain/entities/entity';
import { UniqueEntityID } from '../../../../shared/domain/utils/unique_entity_id';

export class MemberId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: UniqueEntityID): Result<MemberId> {
        return Result.ok<MemberId>(new MemberId(id));
    }
}

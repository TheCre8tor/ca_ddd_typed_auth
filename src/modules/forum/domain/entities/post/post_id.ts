import { Result } from '../../../../../shared/core/result';
import { Entity } from '../../../../../shared/domain/entities/entity';
import { UniqueEntityID } from '../../../../../shared/domain/utils/unique_entity_id';

export class PostId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: UniqueEntityID): Result<PostId> {
        return Result.ok<PostId>(new PostId(id));
    }
}

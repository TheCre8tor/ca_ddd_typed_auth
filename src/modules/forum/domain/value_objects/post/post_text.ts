import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { ValueObject } from '../../../../../shared/domain/value_objects/value_object';

interface PostTextProps {
    value: string;
}

export class PostText extends ValueObject<PostTextProps> {
    public static minLength: number = 2;
    public static maxLength: number = 10000;

    private constructor(props: PostTextProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: PostTextProps): Result<PostText> {
        const nullGuardresult = Guard.againstNullOrUndefined(props.value, 'postText');

        if (!nullGuardresult.succeeded) {
            return Result.fail<PostText>(nullGuardresult.message!);
        }

        const minGuardResult = Guard.againstAtLeast(this.minLength, props.value);
        const maxGuardResult = Guard.againstAtMost(this.maxLength, props.value);

        if (!minGuardResult.succeeded) {
            return Result.fail<PostText>(minGuardResult.message!);
        }

        if (!maxGuardResult.succeeded) {
            return Result.fail<PostText>(maxGuardResult.message!);
        }

        return Result.ok<PostText>(new PostText(props));
    }
}

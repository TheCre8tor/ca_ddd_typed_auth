import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { ValueObject } from '../../../../../shared/domain/value_objects/value_object';

interface PostTitleProps {
    value: string;
}

export class PostTitle extends ValueObject<PostTitleProps> {
    public static minlength: number = 2;
    public static maxLength: number = 85;

    private constructor(props: PostTitleProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: PostTitleProps): Result<PostTitle> {
        const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'postTitle');

        if (!nullGuardResult.succeeded) {
            return Result.fail<PostTitle>(nullGuardResult.message!);
        }

        const minGuardResult = Guard.againstAtLeast(this.minlength, props.value);
        const maxGuardResult = Guard.againstAtMost(this.maxLength, props.value);

        if (!minGuardResult.succeeded) {
            return Result.fail<PostTitle>(minGuardResult.message!);
        }

        if (!maxGuardResult.succeeded) {
            return Result.fail<PostTitle>(maxGuardResult.message!);
        }

        return Result.ok<PostTitle>(new PostTitle(props));
    }
}

import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { ValueObject } from '../../../../../shared/domain/value_objects/value_object';
import { TextSanitizer } from '../../../../../shared/utils/text_sanitizer';

interface PostLinkProps {
    url: string;
}

export class PostLink extends ValueObject<PostLinkProps> {
    private constructor(props: PostLinkProps) {
        super(props);
    }

    get url(): string {
        return this.props.url;
    }

    public static create(props: PostLinkProps): Result<PostLink> {
        const nullGuard = Guard.againstNullOrUndefined(props.url, 'url');

        if (!nullGuard.succeeded) {
            return Result.fail<PostLink>(nullGuard.message!);
        }

        if (!TextSanitizer.validateWebURL(props.url)) {
            return Result.fail<PostLink>(`Url {${props.url}} is not valid.`);
        }

        return Result.ok<PostLink>(new PostLink(props));
    }
}

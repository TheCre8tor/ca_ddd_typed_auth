import slug from 'slug';
import { Result } from '../../../../../shared/core/result';
import { ValueObject } from '../../../../../shared/domain/value_objects/value_object';
import { TextSanitizer } from '../../../../../shared/utils/text_sanitizer';
import { PostTitle } from './post_title';

slug.defaults.mode = 'pretty';
slug.defaults.modes['pretty'] = {
    replacement: '-', // replace spaces with replacement
    symbols: false, // replace unicode symbols or not
    lower: true, // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
};

export interface PostSlugProps {
    value: string;
}

export class PostSlug extends ValueObject<PostSlugProps> {
    private constructor(props: PostSlugProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static createFromExisting(slugName: string) {
        if (!!slugName === true) {
            return Result.ok<PostSlug>(new PostSlug({ value: slugName }));
        }

        return Result.fail<PostSlug>('No slug passed in!');
    }

    public static create(postTitle: PostTitle): Result<PostSlug> {
        let returnSlug = '';

        /* Run the slug algorithm here to create a slug.
           Strip all non alphabetic characters such as ./;, */
        returnSlug = postTitle.value.replace(/[\W_]+/g, ' ');
        returnSlug = TextSanitizer.createRandomNumericString(7) + '-' + slug(postTitle.value);

        return Result.ok<PostSlug>(new PostSlug({ value: returnSlug }));
    }
}

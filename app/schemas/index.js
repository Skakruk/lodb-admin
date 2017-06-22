import {schema} from 'normalizr';

export const media = new schema.Entity('media');

export const mediaList = new schema.Array(media);
media.define({ children: mediaList });

export const articleSchema = new schema.Entity('articles');
export const articleList = new schema.Array(articleSchema);
articleSchema.define({ children: articleList });

export const articleContent = new schema.Entity('articleContent');
export const articleContents = new schema.Array(articleContent);
articleContent.define({ children: articleContents });
articleSchema.define({ content: articleContents });

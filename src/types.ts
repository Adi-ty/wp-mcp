import { z } from "zod";

export const WordPressErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z
    .object({
      status: z.number(),
    })
    .optional(),
});

export const PostStatusSchema = z.enum([
  "publish",
  "future",
  "draft",
  "pending",
  "private",
]);
export const PostFormatSchema = z.enum([
  "standard",
  "aside",
  "chat",
  "gallery",
  "link",
  "image",
  "quote",
  "status",
  "video",
  "audio",
]);

export const PostCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  status: PostStatusSchema.optional().default("draft"),
  slug: z.string().optional(),
  format: PostFormatSchema.optional(),
  categories: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  featured_media: z.number().optional(),
  comment_status: z.enum(["open", "closed"]).optional(),
  ping_status: z.enum(["open", "closed"]).optional(),
  sticky: z.boolean().optional(),
});

export const PostUpdateSchema = PostCreateSchema.partial().extend({
  id: z.number(),
});

export const PostQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  author: z.array(z.number()).optional(),
  author_exclude: z.array(z.number()).optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum([
      "author",
      "date",
      "id",
      "include",
      "modified",
      "parent",
      "relevance",
      "slug",
      "title",
    ])
    .optional(),
  slug: z.array(z.string()).optional(),
  status: z.array(PostStatusSchema).optional(),
  categories: z.array(z.number()).optional(),
  categories_exclude: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  tags_exclude: z.array(z.number()).optional(),
  sticky: z.boolean().optional(),
});

export const PageCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  status: PostStatusSchema.optional().default("draft"),
  slug: z.string().optional(),
  parent: z.number().optional(),
  menu_order: z.number().optional(),
  comment_status: z.enum(["open", "closed"]).optional(),
  ping_status: z.enum(["open", "closed"]).optional(),
  template: z.string().optional(),
});

export const PageUpdateSchema = PageCreateSchema.partial().extend({
  id: z.number(),
});

export const PageQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  author: z.array(z.number()).optional(),
  author_exclude: z.array(z.number()).optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  menu_order: z.number().optional(),
  offset: z.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum([
      "author",
      "date",
      "id",
      "include",
      "modified",
      "parent",
      "relevance",
      "slug",
      "title",
      "menu_order",
    ])
    .optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
  slug: z.array(z.string()).optional(),
  status: z.array(PostStatusSchema).optional(),
});

export const CategoryCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string().optional(),
  parent: z.number().optional(),
  meta: z.record(z.any()).optional(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial().extend({
  id: z.number(),
});

export const CategoryQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum([
      "id",
      "include",
      "name",
      "slug",
      "term_group",
      "description",
      "count",
    ])
    .optional(),
  hide_empty: z.boolean().optional(),
  parent: z.number().optional(),
  post: z.number().optional(),
  slug: z.array(z.string()).optional(),
});

export const TagCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string().optional(),
  meta: z.record(z.any()).optional(),
});

export const TagUpdateSchema = TagCreateSchema.partial().extend({
  id: z.number(),
});

export const TagQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum([
      "id",
      "include",
      "name",
      "slug",
      "term_group",
      "description",
      "count",
    ])
    .optional(),
  hide_empty: z.boolean().optional(),
  post: z.number().optional(),
  slug: z.array(z.string()).optional(),
});

export const MediaUploadSchema = z.object({
  file: z.string(),
  filename: z.string(),
  title: z.string().optional(),
  alt_text: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  post: z.number().optional(),
});

export const MediaUpdateSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  alt_text: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  post: z.number().optional(),
});

export const MediaQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  author: z.array(z.number()).optional(),
  author_exclude: z.array(z.number()).optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum([
      "author",
      "date",
      "id",
      "include",
      "modified",
      "parent",
      "relevance",
      "slug",
      "title",
    ])
    .optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
  media_type: z
    .enum(["image", "video", "text", "application", "audio"])
    .optional(),
  mime_type: z.string().optional(),
});

export const UserCreateSchema = z.object({
  username: z.string(),
  name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email(),
  url: z.string().optional(),
  description: z.string().optional(),
  nickname: z.string().optional(),
  slug: z.string().optional(),
  roles: z.array(z.string()).optional(),
  password: z.string(),
  meta: z.record(z.any()).optional(),
});

export const UserUpdateSchema = UserCreateSchema.partial()
  .extend({
    id: z.number(),
  })
  .omit({ username: true });

export const UserQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum(["id", "include", "name", "registered_date", "slug", "email", "url"])
    .optional(),
  slug: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
});

export const CommentCreateSchema = z.object({
  post: z.number(),
  parent: z.number().optional(),
  content: z.string(),
  author_name: z.string().optional(),
  author_email: z.string().email().optional(),
  author_url: z.string().optional(),
  author_ip: z.string().optional(),
  author_user_agent: z.string().optional(),
  status: z.enum(["hold", "approve", "spam", "trash"]).optional(),
  meta: z.record(z.any()).optional(),
});

export const CommentUpdateSchema = CommentCreateSchema.partial().extend({
  id: z.number(),
});

export const CommentQuerySchema = z.object({
  context: z.enum(["view", "embed", "edit"]).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  author: z.array(z.number()).optional(),
  author_exclude: z.array(z.number()).optional(),
  author_email: z.string().optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderby: z
    .enum(["date", "date_gmt", "id", "include", "post", "parent", "type"])
    .optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
  post: z.array(z.number()).optional(),
  status: z.enum(["hold", "approve", "all", "spam", "trash"]).optional(),
  type: z.string().optional(),
  password: z.string().optional(),
});

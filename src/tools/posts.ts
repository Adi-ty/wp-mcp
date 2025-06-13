import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  wpRequest,
  buildQueryString,
  formatSuccessResponse,
  formatErrorResponse,
  WP_ENDPOINTS,
} from "../utils.js";

/**
 * Register all post-related tools
 */
export function registerPostTools(server: McpServer) {
  server.tool(
    "get_posts",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      author: z.array(z.number()).optional(),
      categories: z.array(z.number()).optional(),
      tags: z.array(z.number()).optional(),
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
      sticky: z.boolean().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.POSTS}?${queryString}`
          : WP_ENDPOINTS.POSTS;
        const posts = await wpRequest(endpoint);

        return formatSuccessResponse(posts, `Found ${posts.length} posts`);
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_post", { id: z.number() }, async ({ id }) => {
    try {
      const post = await wpRequest(`${WP_ENDPOINTS.POSTS}/${id}`);
      return formatSuccessResponse(post, `Post details for ID: ${id}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "create_post",
    {
      title: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      status: z
        .enum(["publish", "future", "draft", "pending", "private"])
        .optional(),
      slug: z.string().optional(),
      categories: z.array(z.number()).optional(),
      tags: z.array(z.number()).optional(),
      featured_media: z.number().optional(),
      comment_status: z.enum(["open", "closed"]).optional(),
      ping_status: z.enum(["open", "closed"]).optional(),
      sticky: z.boolean().optional(),
    },
    async (postData) => {
      try {
        const newPost = await wpRequest(WP_ENDPOINTS.POSTS, {
          method: "POST",
          body: JSON.stringify(postData),
        });

        return formatSuccessResponse(
          newPost,
          `✅ Post created successfully!\n\nID: ${newPost.id}\nTitle: ${
            newPost.title?.rendered || postData.title
          }\nStatus: ${newPost.status}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_post",
    {
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      status: z
        .enum(["publish", "future", "draft", "pending", "private"])
        .optional(),
      slug: z.string().optional(),
      categories: z.array(z.number()).optional(),
      tags: z.array(z.number()).optional(),
      featured_media: z.number().optional(),
      comment_status: z.enum(["open", "closed"]).optional(),
      ping_status: z.enum(["open", "closed"]).optional(),
      sticky: z.boolean().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedPost = await wpRequest(`${WP_ENDPOINTS.POSTS}/${id}`, {
          method: "POST",
          body: JSON.stringify(updateData),
        });

        return formatSuccessResponse(
          updatedPost,
          `✅ Post updated successfully!\n\nID: ${updatedPost.id}\nTitle: ${updatedPost.title?.rendered}\nStatus: ${updatedPost.status}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_post",
    {
      id: z.number(),
      force: z.boolean().optional(),
    },
    async ({ id, force = false }) => {
      try {
        const deleteResult = await wpRequest(`${WP_ENDPOINTS.POSTS}/${id}`, {
          method: "DELETE",
          body: JSON.stringify({ force }),
        });

        return formatSuccessResponse(
          deleteResult,
          `✅ Post ${
            force ? "permanently deleted" : "moved to trash"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_post_revisions",
    {
      post_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().optional(),
    },
    async ({ post_id, ...params }) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.POSTS}/${post_id}/revisions?${queryString}`
          : `${WP_ENDPOINTS.POSTS}/${post_id}/revisions`;

        const revisions = await wpRequest(endpoint);
        return formatSuccessResponse(
          revisions,
          `Found ${revisions.length} revisions for post ${post_id}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_post_by_slug",
    {
      slug: z.string(),
      status: z.array(z.string()).optional(),
    },
    async ({ slug, status }) => {
      try {
        const params: any = { slug: [slug] };
        if (status) params.status = status;

        const queryString = buildQueryString(params);
        const posts = await wpRequest(`${WP_ENDPOINTS.POSTS}?${queryString}`);

        if (posts.length === 0) {
          return formatErrorResponse(
            new Error(`No post found with slug: ${slug}`)
          );
        }

        return formatSuccessResponse(posts[0], `Post found with slug: ${slug}`);
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

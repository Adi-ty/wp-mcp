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
 * Register all user-related tools
 */
export function registerUserTools(server: McpServer) {
  server.tool(
    "get_users",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      search: z.string().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      orderby: z
        .enum([
          "id",
          "include",
          "name",
          "registered_date",
          "slug",
          "email",
          "url",
        ])
        .optional(),
      roles: z.array(z.string()).optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.USERS}?${queryString}`
          : WP_ENDPOINTS.USERS;
        const users = await wpRequest(endpoint);

        return formatSuccessResponse(users, `Found ${users.length} users`);
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_user", { id: z.number() }, async ({ id }) => {
    try {
      const user = await wpRequest(`${WP_ENDPOINTS.USERS}/${id}`);
      return formatSuccessResponse(user, `User details for ID: ${id}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "create_user",
    {
      username: z.string(),
      email: z.string().email(),
      password: z.string(),
      name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      url: z.string().optional(),
      description: z.string().optional(),
      nickname: z.string().optional(),
      slug: z.string().optional(),
      roles: z.array(z.string()).optional(),
    },
    async (userData) => {
      try {
        const newUser = await wpRequest(WP_ENDPOINTS.USERS, {
          method: "POST",
          body: JSON.stringify(userData),
        });

        return formatSuccessResponse(
          newUser,
          `✅ User created successfully!\n\nID: ${newUser.id}\nUsername: ${newUser.username}\nEmail: ${newUser.email}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_user",
    {
      id: z.number(),
      email: z.string().email().optional(),
      name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      url: z.string().optional(),
      description: z.string().optional(),
      nickname: z.string().optional(),
      slug: z.string().optional(),
      roles: z.array(z.string()).optional(),
      password: z.string().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedUser = await wpRequest(`${WP_ENDPOINTS.USERS}/${id}`, {
          method: "POST",
          body: JSON.stringify(updateData),
        });

        return formatSuccessResponse(
          updatedUser,
          `✅ User updated successfully!\n\nID: ${updatedUser.id}\nName: ${updatedUser.name}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_user",
    {
      id: z.number(),
      force: z.boolean().optional(),
      reassign: z.number().optional(),
    },
    async ({ id, force = false, reassign }) => {
      try {
        const deleteData: any = { force };
        if (reassign) deleteData.reassign = reassign;

        const deleteResult = await wpRequest(`${WP_ENDPOINTS.USERS}/${id}`, {
          method: "DELETE",
          body: JSON.stringify(deleteData),
        });

        return formatSuccessResponse(
          deleteResult,
          `✅ User ${
            force ? "permanently deleted" : "deactivated"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_current_user", {}, async () => {
    try {
      const user = await wpRequest(`${WP_ENDPOINTS.USERS}/me`);
      return formatSuccessResponse(user, `Current user details`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });
}

/**
 * Register all comment-related tools
 */
export function registerCommentTools(server: McpServer) {
  server.tool(
    "get_comments",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      search: z.string().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      orderby: z
        .enum(["date", "date_gmt", "id", "include", "post", "parent", "type"])
        .optional(),
      post: z.array(z.number()).optional(),
      parent: z.number().optional(),
      status: z.enum(["hold", "approve", "all", "spam", "trash"]).optional(),
      type: z.string().optional(),
      author_email: z.string().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.COMMENTS}?${queryString}`
          : WP_ENDPOINTS.COMMENTS;
        const comments = await wpRequest(endpoint);

        return formatSuccessResponse(
          comments,
          `Found ${comments.length} comments`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_comment", { id: z.number() }, async ({ id }) => {
    try {
      const comment = await wpRequest(`${WP_ENDPOINTS.COMMENTS}/${id}`);
      return formatSuccessResponse(comment, `Comment details for ID: ${id}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "create_comment",
    {
      post: z.number(),
      content: z.string(),
      parent: z.number().optional(),
      author_name: z.string().optional(),
      author_email: z.string().email().optional(),
      author_url: z.string().optional(),
      status: z.enum(["hold", "approve", "spam", "trash"]).optional(),
    },
    async (commentData) => {
      try {
        const newComment = await wpRequest(WP_ENDPOINTS.COMMENTS, {
          method: "POST",
          body: JSON.stringify(commentData),
        });

        return formatSuccessResponse(
          newComment,
          `✅ Comment created successfully!\n\nID: ${newComment.id}\nPost: ${newComment.post}\nStatus: ${newComment.status}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_comment",
    {
      id: z.number(),
      content: z.string().optional(),
      status: z.enum(["hold", "approve", "spam", "trash"]).optional(),
      author_name: z.string().optional(),
      author_email: z.string().email().optional(),
      author_url: z.string().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedComment = await wpRequest(
          `${WP_ENDPOINTS.COMMENTS}/${id}`,
          {
            method: "POST",
            body: JSON.stringify(updateData),
          }
        );

        return formatSuccessResponse(
          updatedComment,
          `✅ Comment updated successfully!\n\nID: ${updatedComment.id}\nStatus: ${updatedComment.status}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_comment",
    {
      id: z.number(),
      force: z.boolean().optional(),
    },
    async ({ id, force = false }) => {
      try {
        const deleteResult = await wpRequest(`${WP_ENDPOINTS.COMMENTS}/${id}`, {
          method: "DELETE",
          body: JSON.stringify({ force }),
        });

        return formatSuccessResponse(
          deleteResult,
          `✅ Comment ${
            force ? "permanently deleted" : "moved to trash"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_comments_by_post",
    {
      post_id: z.number(),
      per_page: z.number().optional(),
      status: z.enum(["hold", "approve", "all", "spam", "trash"]).optional(),
      order: z.enum(["asc", "desc"]).optional(),
    },
    async ({ post_id, ...params }) => {
      try {
        const queryParams = { ...params, post: [post_id] };
        const queryString = buildQueryString(queryParams);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.COMMENTS}?${queryString}`
          : `${WP_ENDPOINTS.COMMENTS}?post=${post_id}`;

        const comments = await wpRequest(endpoint);
        return formatSuccessResponse(
          comments,
          `Found ${comments.length} comments for post ${post_id}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

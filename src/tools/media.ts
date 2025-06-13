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
 * Register all media-related tools
 */
export function registerMediaTools(server: McpServer) {
  server.tool(
    "get_media",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      search: z.string().optional(),
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
      parent: z.number().optional(),
      media_type: z
        .enum(["image", "video", "text", "application", "audio"])
        .optional(),
      mime_type: z.string().optional(),
      author: z.array(z.number()).optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.MEDIA}?${queryString}`
          : WP_ENDPOINTS.MEDIA;
        const media = await wpRequest(endpoint);

        return formatSuccessResponse(
          media,
          `Found ${media.length} media items`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_media_item", { id: z.number() }, async ({ id }) => {
    try {
      const mediaItem = await wpRequest(`${WP_ENDPOINTS.MEDIA}/${id}`);
      return formatSuccessResponse(
        mediaItem,
        `Media item details for ID: ${id}`
      );
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "upload_media",
    {
      filename: z.string(),
      content_base64: z.string(),
      title: z.string().optional(),
      alt_text: z.string().optional(),
      caption: z.string().optional(),
      description: z.string().optional(),
      post: z.number().optional(),
    },
    async ({
      filename,
      content_base64,
      title,
      alt_text,
      caption,
      description,
      post,
    }) => {
      try {
        const binaryContent = Buffer.from(content_base64, "base64");

        const uploadResponse = await wpRequest(WP_ENDPOINTS.MEDIA, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
          body: binaryContent,
        });

        if (title || alt_text || caption || description || post) {
          const updateData: any = {};
          if (title) updateData.title = title;
          if (alt_text) updateData.alt_text = alt_text;
          if (caption) updateData.caption = caption;
          if (description) updateData.description = description;
          if (post) updateData.post = post;

          const updatedMedia = await wpRequest(
            `${WP_ENDPOINTS.MEDIA}/${uploadResponse.id}`,
            {
              method: "POST",
              body: JSON.stringify(updateData),
            }
          );

          return formatSuccessResponse(
            updatedMedia,
            `✅ Media uploaded and updated successfully!\n\nID: ${updatedMedia.id}\nFilename: ${filename}\nURL: ${updatedMedia.source_url}`
          );
        }

        return formatSuccessResponse(
          uploadResponse,
          `✅ Media uploaded successfully!\n\nID: ${uploadResponse.id}\nFilename: ${filename}\nURL: ${uploadResponse.source_url}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_media",
    {
      id: z.number(),
      title: z.string().optional(),
      alt_text: z.string().optional(),
      caption: z.string().optional(),
      description: z.string().optional(),
      post: z.number().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedMedia = await wpRequest(`${WP_ENDPOINTS.MEDIA}/${id}`, {
          method: "POST",
          body: JSON.stringify(updateData),
        });

        return formatSuccessResponse(
          updatedMedia,
          `✅ Media updated successfully!\n\nID: ${updatedMedia.id}\nTitle: ${updatedMedia.title?.rendered}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_media",
    {
      id: z.number(),
      force: z.boolean().optional(),
    },
    async ({ id, force = false }) => {
      try {
        const deleteResult = await wpRequest(`${WP_ENDPOINTS.MEDIA}/${id}`, {
          method: "DELETE",
          body: JSON.stringify({ force }),
        });

        return formatSuccessResponse(
          deleteResult,
          `✅ Media ${
            force ? "permanently deleted" : "moved to trash"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_media_by_post",
    {
      post_id: z.number(),
      per_page: z.number().optional(),
      media_type: z
        .enum(["image", "video", "text", "application", "audio"])
        .optional(),
    },
    async ({ post_id, ...params }) => {
      try {
        const queryParams = { ...params, parent: post_id };
        const queryString = buildQueryString(queryParams);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.MEDIA}?${queryString}`
          : `${WP_ENDPOINTS.MEDIA}?parent=${post_id}`;

        const media = await wpRequest(endpoint);
        return formatSuccessResponse(
          media,
          `Found ${media.length} media items for post ${post_id}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

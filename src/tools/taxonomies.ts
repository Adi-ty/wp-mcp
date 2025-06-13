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
 * Register all category-related tools
 */
export function registerCategoryTools(server: McpServer) {
  server.tool(
    "get_categories",
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
          "slug",
          "term_group",
          "description",
          "count",
        ])
        .optional(),
      hide_empty: z.boolean().optional(),
      parent: z.number().optional(),
      post: z.number().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.CATEGORIES}?${queryString}`
          : WP_ENDPOINTS.CATEGORIES;
        const categories = await wpRequest(endpoint);

        return formatSuccessResponse(
          categories,
          `Found ${categories.length} categories`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_category", { id: z.number() }, async ({ id }) => {
    try {
      const category = await wpRequest(`${WP_ENDPOINTS.CATEGORIES}/${id}`);
      return formatSuccessResponse(category, `Category details for ID: ${id}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "create_category",
    {
      name: z.string(),
      description: z.string().optional(),
      slug: z.string().optional(),
      parent: z.number().optional(),
    },
    async (categoryData) => {
      try {
        const newCategory = await wpRequest(WP_ENDPOINTS.CATEGORIES, {
          method: "POST",
          body: JSON.stringify(categoryData),
        });

        return formatSuccessResponse(
          newCategory,
          `✅ Category created successfully!\n\nID: ${newCategory.id}\nName: ${newCategory.name}\nSlug: ${newCategory.slug}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_category",
    {
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      slug: z.string().optional(),
      parent: z.number().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedCategory = await wpRequest(
          `${WP_ENDPOINTS.CATEGORIES}/${id}`,
          {
            method: "POST",
            body: JSON.stringify(updateData),
          }
        );

        return formatSuccessResponse(
          updatedCategory,
          `✅ Category updated successfully!\n\nID: ${updatedCategory.id}\nName: ${updatedCategory.name}\nSlug: ${updatedCategory.slug}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_category",
    {
      id: z.number(),
      force: z.boolean().optional(),
    },
    async ({ id, force = false }) => {
      try {
        const deleteResult = await wpRequest(
          `${WP_ENDPOINTS.CATEGORIES}/${id}`,
          {
            method: "DELETE",
            body: JSON.stringify({ force }),
          }
        );

        return formatSuccessResponse(
          deleteResult,
          `✅ Category ${
            force ? "permanently deleted" : "moved to trash"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

/**
 * Register all tag-related tools
 */
export function registerTagTools(server: McpServer) {
  server.tool(
    "get_tags",
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
          "slug",
          "term_group",
          "description",
          "count",
        ])
        .optional(),
      hide_empty: z.boolean().optional(),
      post: z.number().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.TAGS}?${queryString}`
          : WP_ENDPOINTS.TAGS;
        const tags = await wpRequest(endpoint);

        return formatSuccessResponse(tags, `Found ${tags.length} tags`);
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_tag", { id: z.number() }, async ({ id }) => {
    try {
      const tag = await wpRequest(`${WP_ENDPOINTS.TAGS}/${id}`);
      return formatSuccessResponse(tag, `Tag details for ID: ${id}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "create_tag",
    {
      name: z.string(),
      description: z.string().optional(),
      slug: z.string().optional(),
    },
    async (tagData) => {
      try {
        const newTag = await wpRequest(WP_ENDPOINTS.TAGS, {
          method: "POST",
          body: JSON.stringify(tagData),
        });

        return formatSuccessResponse(
          newTag,
          `✅ Tag created successfully!\n\nID: ${newTag.id}\nName: ${newTag.name}\nSlug: ${newTag.slug}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_tag",
    {
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      slug: z.string().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedTag = await wpRequest(`${WP_ENDPOINTS.TAGS}/${id}`, {
          method: "POST",
          body: JSON.stringify(updateData),
        });

        return formatSuccessResponse(
          updatedTag,
          `✅ Tag updated successfully!\n\nID: ${updatedTag.id}\nName: ${updatedTag.name}\nSlug: ${updatedTag.slug}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_tag",
    {
      id: z.number(),
      force: z.boolean().optional(),
    },
    async ({ id, force = false }) => {
      try {
        const deleteResult = await wpRequest(`${WP_ENDPOINTS.TAGS}/${id}`, {
          method: "DELETE",
          body: JSON.stringify({ force }),
        });

        return formatSuccessResponse(
          deleteResult,
          `✅ Tag ${
            force ? "permanently deleted" : "moved to trash"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

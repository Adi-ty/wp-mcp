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
 * Register all page-related tools
 */
export function registerPageTools(server: McpServer) {
  server.tool(
    "get_pages",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      author: z.array(z.number()).optional(),
      parent: z.number().optional(),
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
      menu_order: z.number().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.PAGES}?${queryString}`
          : WP_ENDPOINTS.PAGES;
        const pages = await wpRequest(endpoint);

        return formatSuccessResponse(pages, `Found ${pages.length} pages`);
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_page", { id: z.number() }, async ({ id }) => {
    try {
      const page = await wpRequest(`${WP_ENDPOINTS.PAGES}/${id}`);
      return formatSuccessResponse(page, `Page details for ID: ${id}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "create_page",
    {
      title: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      status: z
        .enum(["publish", "future", "draft", "pending", "private"])
        .optional(),
      slug: z.string().optional(),
      parent: z.number().optional(),
      menu_order: z.number().optional(),
      comment_status: z.enum(["open", "closed"]).optional(),
      ping_status: z.enum(["open", "closed"]).optional(),
      template: z.string().optional(),
    },
    async (pageData) => {
      try {
        const newPage = await wpRequest(WP_ENDPOINTS.PAGES, {
          method: "POST",
          body: JSON.stringify(pageData),
        });

        return formatSuccessResponse(
          newPage,
          `✅ Page created successfully!\n\nID: ${newPage.id}\nTitle: ${
            newPage.title?.rendered || pageData.title
          }\nStatus: ${newPage.status}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "update_page",
    {
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      status: z
        .enum(["publish", "future", "draft", "pending", "private"])
        .optional(),
      slug: z.string().optional(),
      parent: z.number().optional(),
      menu_order: z.number().optional(),
      comment_status: z.enum(["open", "closed"]).optional(),
      ping_status: z.enum(["open", "closed"]).optional(),
      template: z.string().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const updatedPage = await wpRequest(`${WP_ENDPOINTS.PAGES}/${id}`, {
          method: "POST",
          body: JSON.stringify(updateData),
        });

        return formatSuccessResponse(
          updatedPage,
          `✅ Page updated successfully!\n\nID: ${updatedPage.id}\nTitle: ${updatedPage.title?.rendered}\nStatus: ${updatedPage.status}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_page",
    {
      id: z.number(),
      force: z.boolean().optional(),
    },
    async ({ id, force = false }) => {
      try {
        const deleteResult = await wpRequest(`${WP_ENDPOINTS.PAGES}/${id}`, {
          method: "DELETE",
          body: JSON.stringify({ force }),
        });

        return formatSuccessResponse(
          deleteResult,
          `✅ Page ${
            force ? "permanently deleted" : "moved to trash"
          } successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_page_by_slug",
    {
      slug: z.string(),
      status: z.array(z.string()).optional(),
    },
    async ({ slug, status }) => {
      try {
        const params: any = { slug: [slug] };
        if (status) params.status = status;

        const queryString = buildQueryString(params);
        const pages = await wpRequest(`${WP_ENDPOINTS.PAGES}?${queryString}`);

        if (pages.length === 0) {
          return formatErrorResponse(
            new Error(`No page found with slug: ${slug}`)
          );
        }

        return formatSuccessResponse(pages[0], `Page found with slug: ${slug}`);
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_page_children",
    {
      parent_id: z.number(),
      per_page: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      orderby: z.enum(["date", "id", "title", "menu_order"]).optional(),
    },
    async ({ parent_id, ...params }) => {
      try {
        const queryParams = { ...params, parent: parent_id };
        const queryString = buildQueryString(queryParams);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.PAGES}?${queryString}`
          : `${WP_ENDPOINTS.PAGES}?parent=${parent_id}`;

        const childPages = await wpRequest(endpoint);
        return formatSuccessResponse(
          childPages,
          `Found ${childPages.length} child pages for parent ${parent_id}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

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
 * Register all system information and settings tools
 */
export function registerSystemTools(server: McpServer) {
  server.tool("get_settings", {}, async () => {
    try {
      const settings = await wpRequest(WP_ENDPOINTS.SETTINGS);
      return formatSuccessResponse(settings, `WordPress settings retrieved`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "update_settings",
    {
      title: z.string().optional(),
      description: z.string().optional(),
      url: z.string().optional(),
      email: z.string().email().optional(),
      timezone: z.string().optional(),
      date_format: z.string().optional(),
      time_format: z.string().optional(),
      start_of_week: z.number().min(0).max(6).optional(),
      language: z.string().optional(),
      use_smilies: z.boolean().optional(),
      default_category: z.number().optional(),
      default_post_format: z.string().optional(),
      posts_per_page: z.number().optional(),
      default_ping_status: z.enum(["open", "closed"]).optional(),
      default_comment_status: z.enum(["open", "closed"]).optional(),
    },
    async (settingsData) => {
      try {
        const updatedSettings = await wpRequest(WP_ENDPOINTS.SETTINGS, {
          method: "POST",
          body: JSON.stringify(settingsData),
        });

        return formatSuccessResponse(
          updatedSettings,
          `✅ WordPress settings updated successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_post_types", {}, async () => {
    try {
      const postTypes = await wpRequest(WP_ENDPOINTS.POST_TYPES);
      return formatSuccessResponse(
        postTypes,
        `Found ${Object.keys(postTypes).length} post types`
      );
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool("get_post_type", { type: z.string() }, async ({ type }) => {
    try {
      const postType = await wpRequest(`${WP_ENDPOINTS.POST_TYPES}/${type}`);
      return formatSuccessResponse(postType, `Post type details for: ${type}`);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool("get_post_statuses", {}, async () => {
    try {
      const statuses = await wpRequest(WP_ENDPOINTS.POST_STATUSES);
      return formatSuccessResponse(
        statuses,
        `Found ${Object.keys(statuses).length} post statuses`
      );
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool("get_post_status", { status: z.string() }, async ({ status }) => {
    try {
      const postStatus = await wpRequest(
        `${WP_ENDPOINTS.POST_STATUSES}/${status}`
      );
      return formatSuccessResponse(
        postStatus,
        `Post status details for: ${status}`
      );
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "get_taxonomies",
    {
      type: z.string().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.TAXONOMIES}?${queryString}`
          : WP_ENDPOINTS.TAXONOMIES;
        const taxonomies = await wpRequest(endpoint);

        return formatSuccessResponse(
          taxonomies,
          `Found ${Object.keys(taxonomies).length} taxonomies`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_taxonomy",
    { taxonomy: z.string() },
    async ({ taxonomy }) => {
      try {
        const taxonomyData = await wpRequest(
          `${WP_ENDPOINTS.TAXONOMIES}/${taxonomy}`
        );
        return formatSuccessResponse(
          taxonomyData,
          `Taxonomy details for: ${taxonomy}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_block_types",
    {
      namespace: z.string().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = queryString
          ? `${WP_ENDPOINTS.BLOCK_TYPES}?${queryString}`
          : WP_ENDPOINTS.BLOCK_TYPES;
        const blockTypes = await wpRequest(endpoint);

        return formatSuccessResponse(
          blockTypes,
          `Found ${blockTypes.length} block types`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "get_block_type",
    {
      namespace: z.string(),
      name: z.string(),
    },
    async ({ namespace, name }) => {
      try {
        const blockType = await wpRequest(
          `${WP_ENDPOINTS.BLOCK_TYPES}/${namespace}/${name}`
        );
        return formatSuccessResponse(
          blockType,
          `Block type details for: ${namespace}/${name}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "search_wordpress",
    {
      search: z.string(),
      type: z.array(z.enum(["post", "page", "attachment"])).optional(),
      subtype: z.array(z.string()).optional(),
      per_page: z.number().optional(),
      page: z.number().optional(),
    },
    async (params) => {
      try {
        const queryString = buildQueryString(params);
        const endpoint = `/search?${queryString}`;
        const results = await wpRequest(endpoint);

        return formatSuccessResponse(
          results,
          `Found ${results.length} search results for: "${params.search}"`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool("get_site_health", {}, async () => {
    try {
      const siteHealth = await wpRequest("/site-health/tests");
      return formatSuccessResponse(
        siteHealth,
        `Site health information retrieved`
      );
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  server.tool(
    "get_application_passwords",
    {
      user_id: z.number(),
    },
    async ({ user_id }) => {
      try {
        const passwords = await wpRequest(
          `${WP_ENDPOINTS.USERS}/${user_id}/application-passwords`
        );
        return formatSuccessResponse(
          passwords,
          `Found ${passwords.length} application passwords for user ${user_id}`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "create_application_password",
    {
      user_id: z.number(),
      name: z.string(),
    },
    async ({ user_id, name }) => {
      try {
        const newPassword = await wpRequest(
          `${WP_ENDPOINTS.USERS}/${user_id}/application-passwords`,
          {
            method: "POST",
            body: JSON.stringify({ name }),
          }
        );

        return formatSuccessResponse(
          newPassword,
          `✅ Application password created successfully!\n\nName: ${name}\n⚠️  Save this password: ${newPassword.password}\nIt will not be shown again!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );

  server.tool(
    "delete_application_password",
    {
      user_id: z.number(),
      uuid: z.string(),
    },
    async ({ user_id, uuid }) => {
      try {
        const deleteResult = await wpRequest(
          `${WP_ENDPOINTS.USERS}/${user_id}/application-passwords/${uuid}`,
          {
            method: "DELETE",
          }
        );

        return formatSuccessResponse(
          deleteResult,
          `✅ Application password deleted successfully!`
        );
      } catch (error) {
        return formatErrorResponse(error);
      }
    }
  );
}

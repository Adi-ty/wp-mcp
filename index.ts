import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const WP_BASE_URL = process.env.WP_BASE_URL || "http://localhost:8080";
const WP_USERNAME = process.env.WP_USERNAME || "";
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || "";

async function wpRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${WP_BASE_URL}/wp-json/wp/v2${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (WP_USERNAME && WP_APP_PASSWORD) {
    const credentials = btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`);
    headers["Authorization"] = `Basic ${credentials}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

const server = new McpServer({
  name: "WordPress MCP Server",
  version: "1.0.0",
});

server.tool(
  "get_posts",
  {
    per_page: z.number().optional(),
    page: z.number().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
  },
  async ({ per_page, page, search, status }) => {
    try {
      const params = new URLSearchParams();
      if (per_page) params.append("per_page", per_page.toString());
      if (page) params.append("page", page.toString());
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const posts = await wpRequest(`/posts?${params.toString()}`);

      return {
        content: [
          {
            type: "text",
            text: `Found ${posts.length} posts:\n\n${JSON.stringify(
              posts,
              null,
              2
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool("get_post", { id: z.number() }, async ({ id }) => {
  try {
    const post = await wpRequest(`/posts/${id}`);
    return {
      content: [
        {
          type: "text",
          text: `Post details:\n\n${JSON.stringify(post, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

server.tool(
  "create_post",
  {
    title: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    status: z.string().optional(),
    slug: z.string().optional(),
  },
  async ({ title, content, excerpt, status, slug }) => {
    try {
      const postData = { title, content, excerpt, status, slug };
      const newPost = await wpRequest("/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Post created successfully!\n\nID: ${newPost.id}\nTitle: ${
              newPost.title?.rendered || title
            }\nStatus: ${newPost.status}\n\nFull details:\n${JSON.stringify(
              newPost,
              null,
              2
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
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
    status: z.string().optional(),
    slug: z.string().optional(),
  },
  async ({ id, title, content, excerpt, status, slug }) => {
    try {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (status !== undefined) updateData.status = status;
      if (slug !== undefined) updateData.slug = slug;

      const updatedPost = await wpRequest(`/posts/${id}`, {
        method: "POST",
        body: JSON.stringify(updateData),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Post updated successfully!\n\nID: ${
              updatedPost.id
            }\nTitle: ${updatedPost.title?.rendered || "No title"}\nStatus: ${
              updatedPost.status
            }\n\nFull details:\n${JSON.stringify(updatedPost, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
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
      const deleteResult = await wpRequest(`/posts/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ force }),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Post deleted successfully!\n\n${JSON.stringify(
              deleteResult,
              null,
              2
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

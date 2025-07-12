import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerPostTools } from "./tools/posts.js";
import { registerPageTools } from "./tools/pages.js";
import { registerCategoryTools, registerTagTools } from "./tools/taxonomies.js";
import { registerMediaTools } from "./tools/media.js";
import {
  registerUserTools,
  registerCommentTools,
} from "./tools/users-comments.js";
import { registerSystemTools } from "./tools/system.js";

const server = new McpServer({
  name: "WordPress MCP Server",
  version: "2.0.0",
  description:
    "Complete WordPress REST API integration for posts, pages, media, users, comments, and system management",
});

try {
  registerPostTools(server);
  registerPageTools(server);
  registerCategoryTools(server);
  registerTagTools(server);
  registerMediaTools(server);
  registerUserTools(server);
  registerCommentTools(server);
  registerSystemTools(server);
} catch (error) {
  console.error("❌ Error registering tools:", error);
  process.exit(1);
}

const transport = new StdioServerTransport();
await server.connect(transport);

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerPostTools } from "./src/tools/posts.js";
import { registerPageTools } from "./src/tools/pages.js";
import {
  registerCategoryTools,
  registerTagTools,
} from "./src/tools/taxonomies.js";
import { registerMediaTools } from "./src/tools/media.js";
import {
  registerUserTools,
  registerCommentTools,
} from "./src/tools/users-comments.js";
import { registerSystemTools } from "./src/tools/system.js";

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

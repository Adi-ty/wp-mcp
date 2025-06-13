const WP_BASE_URL = process.env.WP_BASE_URL || "http://localhost:8080";
const WP_USERNAME = process.env.WP_USERNAME || "";
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || "";

export interface WordPressResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export interface WordPressError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

/**
 * Makes authenticated requests to WordPress REST API
 */
export async function wpRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
    let errorMessage = `WordPress API error: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // If we can't parse error JSON, use the status text
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Builds query string from parameters object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  return searchParams.toString();
}

/**
 * Formats successful response for MCP tools
 */
export function formatSuccessResponse(data: any, message?: string): any {
  const text = message
    ? `${message}\n\n${JSON.stringify(data, null, 2)}`
    : JSON.stringify(data, null, 2);

  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

/**
 * Formats error response for MCP tools
 */
export function formatErrorResponse(error: any): any {
  const message = error instanceof Error ? error.message : String(error);

  return {
    content: [
      {
        type: "text",
        text: `Error: ${message}`,
      },
    ],
    isError: true,
  };
}

/**
 * Generic handler for WordPress REST API endpoints
 */
export async function handleWordPressRequest<T = any>(
  endpoint: string,
  options?: RequestInit,
  successMessage?: string
): Promise<any> {
  try {
    const data = await wpRequest<T>(endpoint, options);
    return formatSuccessResponse(data, successMessage);
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * WordPress REST API endpoints configuration
 */
export const WP_ENDPOINTS = {
  POSTS: "/posts",
  PAGES: "/pages",
  CATEGORIES: "/categories",
  TAGS: "/tags",
  MEDIA: "/media",
  USERS: "/users",
  COMMENTS: "/comments",
  SETTINGS: "/settings",
  TAXONOMIES: "/taxonomies",
  POST_TYPES: "/types",
  POST_STATUSES: "/statuses",
  BLOCKS: "/blocks",
  BLOCK_TYPES: "/block-types",
  PLUGINS: "/plugins",
  THEMES: "/themes",
} as const;

/**
 * Common WordPress capabilities
 */
export const WP_CAPABILITIES = {
  READ: "read",
  EDIT_POSTS: "edit_posts",
  EDIT_OTHERS_POSTS: "edit_others_posts",
  EDIT_PUBLISHED_POSTS: "edit_published_posts",
  PUBLISH_POSTS: "publish_posts",
  DELETE_POSTS: "delete_posts",
  DELETE_OTHERS_POSTS: "delete_others_posts",
  DELETE_PUBLISHED_POSTS: "delete_published_posts",
  EDIT_PAGES: "edit_pages",
  EDIT_OTHERS_PAGES: "edit_others_pages",
  EDIT_PUBLISHED_PAGES: "edit_published_pages",
  PUBLISH_PAGES: "publish_pages",
  DELETE_PAGES: "delete_pages",
  DELETE_OTHERS_PAGES: "delete_others_pages",
  DELETE_PUBLISHED_PAGES: "delete_published_pages",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_OPTIONS: "manage_options",
  MODERATE_COMMENTS: "moderate_comments",
  UPLOAD_FILES: "upload_files",
  CREATE_USERS: "create_users",
  LIST_USERS: "list_users",
  EDIT_USERS: "edit_users",
  DELETE_USERS: "delete_users",
} as const;

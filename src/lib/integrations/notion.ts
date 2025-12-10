/**
 * @file notion.ts
 * @description Notion API integration for GettUpp Business Hub sync
 * @module lib/integrations/notion
 */

/**
 * Notion Business Hub Configuration
 * The Business Hub serves as the source of truth for:
 * - Project tracking
 * - Client CRM
 * - Content calendar
 * - Team operations
 */
export const NOTION_CONFIG = {
  // Main business hub page ID
  BUSINESS_HUB_ID: '82109bb7-563b-4f96-bfa2-d1bcb76e23b5',
  
  // Key database IDs (found in your Notion workspace)
  DATABASES: {
    PROJECTS: '8c916197-97c9-49d8-8d8d-9b115688a6f3', // Venture Portfolio
    INBOX: '2bf74da0-cd12-81b1-b1eb-fd684f95ee23',    // AI-Sync Inbox
  },
  
  // API version for requests
  API_VERSION: '2022-06-28',
} as const;

/**
 * Type definitions for Notion data structures
 */
export interface NotionProject {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'active' | 'completed';
  progress: number;
  tier?: string;
  revenue?: number;
}

export interface NotionClient {
  id: string;
  venueName: string;
  contactEmail: string;
  tier: string;
  subscriptionStatus: string;
}

/**
 * Fetch projects from Notion Business Hub
 * @returns Array of projects with their status
 */
export async function fetchNotionProjects(): Promise<NotionProject[]> {
  const notionApiKey = process.env.NOTION_API_KEY;
  
  if (!notionApiKey) {
    console.warn('NOTION_API_KEY not configured - using mock data');
    return getMockProjects();
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_CONFIG.DATABASES.PROJECTS}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': NOTION_CONFIG.API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 50,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((page: any) => ({
      id: page.id,
      name: page.properties['Project Name']?.title?.[0]?.text?.content || 'Untitled',
      status: mapNotionStatus(page.properties['Status']?.status?.name),
      progress: page.properties['Progress']?.number || 0,
      tier: page.properties['Category']?.select?.name,
      revenue: page.properties['Monthly Revenue']?.number,
    }));
  } catch (error) {
    console.error('Failed to fetch Notion projects:', error);
    return getMockProjects();
  }
}

/**
 * Sync a lead from Firebase to Notion inbox
 * @param lead - Lead data to sync
 */
export async function syncLeadToNotion(lead: {
  id: string;
  venueName: string;
  email: string;
  source: string;
}): Promise<boolean> {
  const notionApiKey = process.env.NOTION_API_KEY;
  
  if (!notionApiKey) {
    console.warn('NOTION_API_KEY not configured - skipping sync');
    return false;
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': NOTION_CONFIG.API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_CONFIG.DATABASES.INBOX },
        properties: {
          'Name': {
            title: [{ text: { content: `New Lead: ${lead.venueName}` } }],
          },
          'Source': {
            select: { name: lead.source },
          },
          'Status': {
            status: { name: 'Not started' },
          },
          'Notes': {
            rich_text: [{ text: { content: `Email: ${lead.email}, Firebase ID: ${lead.id}` } }],
          },
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to sync lead to Notion:', error);
    return false;
  }
}

/**
 * Map Notion status to standardized status
 */
function mapNotionStatus(notionStatus?: string): NotionProject['status'] {
  const statusMap: Record<string, NotionProject['status']> = {
    'Planning': 'planning',
    'In Progress': 'in_progress',
    'Active': 'active',
    'Completed': 'completed',
  };
  return statusMap[notionStatus || ''] || 'planning';
}

/**
 * Mock projects for development without Notion API
 */
function getMockProjects(): NotionProject[] {
  return [
    {
      id: '1',
      name: 'Nightlife Content Machine',
      status: 'active',
      progress: 0.6,
      tier: 'Content Service',
    },
    {
      id: '2',
      name: 'AI Time Arbitrage',
      status: 'active',
      progress: 0.3,
      tier: 'Consulting',
    },
    {
      id: '3',
      name: 'GettUpp Girls - Apparel Brand',
      status: 'planning',
      progress: 0.1,
      tier: 'Apparel/Retail',
    },
  ];
}

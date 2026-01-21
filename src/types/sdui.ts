/**
 * SDUI (Schema-Driven UI) Type Definitions
 * Defines the structure for JSON-based UI schemas used by mini-apps
 */

/**
 * Base component type - all SDUI components extend this
 */
export interface BaseComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  action?: any; // Action object
  validation?: any; // Validation rules
  gridRow?: number;
  rowSpan?: number;
  gridCol?: number;
  colSpan?: number;
}

/**
 * Page component - represents a full page/screen
 */
export interface PageComponent {
  id: string;
  order: number;
  title: string;
  components: BaseComponent[];
}

/**
 * Complete SDUI schema for a mini-app
 */
export interface SDUISchema {
  id: string;
  version: string;
  name: string;
  description: string;
  slug: string;
  is_public: boolean;
  is_published: boolean;
  published_at: string | null;
  navigation: {
    guestPageId: string;
    initialPageId: string;
  };
  pages: PageComponent[];
  metadata: {
    revision: number;
    createdBy: string;
  };
  created_at: string;
  updated_at: string;
  payment?: any;
  permissions?: string[];
  statuses?: string[];
}

/**
 * Union type for all SDUI components
 */
export type SDUIComponent = BaseComponent;


/**
 * Form data structure
 */
export interface FormData {
  [key: string]: string | string[] | File | File[] | null;
}

/**
 * Action handler function type
 */
export type ActionHandler = (
  actionId: string,
  data?: FormData,
  context?: ActionContext
) => Promise<ActionResult> | ActionResult;

/**
 * Action context
 */
export interface ActionContext {
  currentPageId: string;
  formData: FormData;
  navigation?: {
    goToPage: (pageId: string) => void;
    goBack: () => void;
    close: () => void;
  };
}

/**
 * Action result
 */
export interface ActionResult {
  success: boolean;
  message?: string;
  data?: any;
  nextPageId?: string;
  error?: string;
}
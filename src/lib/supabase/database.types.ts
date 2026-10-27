// Generated from the Supabase schema (project manna-project). Regenerate after schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type AdminRole = "superadmin" | "admin";

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" };
  public: {
    Tables: {
      admins: Table<{ email: string; role: AdminRole; invited_by: string | null; created_at: string }, "email">;
      change_log: Table<
        {
          id: number;
          at: string;
          actor: string;
          action: string;
          target_table: string;
          target_id: string;
          before: Json | null;
          after: Json | null;
        },
        "actor" | "action" | "target_table" | "target_id"
      >;
      collections: Table<{ id: string; name: string; blurb: string; sort_order: number; updated_at: string }, "id" | "name">;
      daily_counts: Table<{ day: string; metric: string; key: string; count: number }, "day" | "metric">;
      hidden_verses: Table<
        {
          slug: string;
          reference: string;
          translation: string;
          lines: string[];
          collection_id: string | null;
          sort_order: number;
          updated_at: string;
        },
        "slug" | "reference" | "lines"
      >;
      kids_questions: Table<{ id: number; position: number; question: string; updated_at: string }, "position" | "question">;
      products: Table<
        {
          slug: string;
          name: string;
          category: string;
          blurb: string;
          description: string;
          includes: string[];
          details: Json;
          pairs_with: string[];
          etsy_url: string;
          images: Json;
          featured: boolean;
          published: boolean;
          sort_order: number;
          updated_at: string;
        },
        "slug" | "name" | "category" | "etsy_url"
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      track: { Args: { metric: string; key?: string }; Returns: undefined };
    };
    Enums: { admin_role: AdminRole };
    CompositeTypes: { [_ in never]: never };
  };
};

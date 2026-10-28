// Generated from the Supabase schema (project manna-project). Regenerate after schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type AdminRole = "superadmin" | "admin";
export type ReaderStatus = "pending" | "approved" | "declined";

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
      readers: Table<
        { user_id: string; email: string; status: ReaderStatus; signed_up_at: string; decided_at: string | null; decided_by: string | null },
        "user_id" | "email"
      >;
      reader_data: Table<
        { user_id: string; progress: Json; reflections: Json; found: string[]; updated_at: string },
        "user_id"
      >;
      daily_verses: Table<{ day: string; text: string; reference: string; version: string; fetched_at: string }, "day" | "text" | "reference">;
      kids_questions: Table<{ id: number; position: number; question: string; question_id: string | null; updated_at: string }, "position" | "question">;
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
          shopee_url: string | null;
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
      delete_my_account: { Args: Record<string, never>; Returns: undefined };
      admin_reader_details: {
        Args: { search?: string };
        Returns: {
          user_id: string;
          email: string;
          status: ReaderStatus;
          signed_up_at: string;
          decided_at: string | null;
          decided_by: string | null;
          provider: string;
          last_sign_in_at: string | null;
          mornings: number;
          books: number;
          flowers: number;
          synced_at: string | null;
        }[];
      };
      admin_delete_reader: { Args: { target: string }; Returns: string };
    };
    Enums: { admin_role: AdminRole; reader_status: ReaderStatus };
    CompositeTypes: { [_ in never]: never };
  };
};

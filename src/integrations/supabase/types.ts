export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          event_type: string
          id: string
          lesson_id: string | null
          metadata: Json | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          requirements: Json | null
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirements?: Json | null
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirements?: Json | null
        }
        Relationships: []
      }
      changelog: {
        Row: {
          author: string | null
          change_type: string | null
          description: string | null
          file_updated: string | null
          id: string
          module_name: string
          timestamp: string
        }
        Insert: {
          author?: string | null
          change_type?: string | null
          description?: string | null
          file_updated?: string | null
          id?: string
          module_name: string
          timestamp?: string
        }
        Update: {
          author?: string | null
          change_type?: string | null
          description?: string | null
          file_updated?: string | null
          id?: string
          module_name?: string
          timestamp?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json | null
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["lesson_difficulty"] | null
          estimated_duration: number | null
          id: string
          module_name: string
          order_in_module: number | null
          title: string
          updated_at: string
          weekend_only: boolean | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["lesson_difficulty"] | null
          estimated_duration?: number | null
          id?: string
          module_name: string
          order_in_module?: number | null
          title: string
          updated_at?: string
          weekend_only?: boolean | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["lesson_difficulty"] | null
          estimated_duration?: number | null
          id?: string
          module_name?: string
          order_in_module?: number | null
          title?: string
          updated_at?: string
          weekend_only?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          age_group: Database["public"]["Enums"]["age_group"] | null
          consent_date: string | null
          created_at: string
          first_name: string | null
          guardian_email: string | null
          id: string
          last_name: string | null
          parental_consent: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          age_group?: Database["public"]["Enums"]["age_group"] | null
          consent_date?: string | null
          created_at?: string
          first_name?: string | null
          guardian_email?: string | null
          id?: string
          last_name?: string | null
          parental_consent?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          age_group?: Database["public"]["Enums"]["age_group"] | null
          consent_date?: string | null
          created_at?: string
          first_name?: string | null
          guardian_email?: string | null
          id?: string
          last_name?: string | null
          parental_consent?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          progress_percentage: number | null
          quiz_attempts: number | null
          quiz_score: number | null
          started_at: string | null
          status: string | null
          time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          progress_percentage?: number | null
          quiz_attempts?: number | null
          quiz_score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          progress_percentage?: number | null
          quiz_attempts?: number | null
          quiz_score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      age_group: "child" | "teen" | "adult" | "senior"
      badge_type:
        | "beginner_unlocked"
        | "module_completed"
        | "quiz_master"
        | "weekend_warrior"
      lesson_difficulty: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_group: ["child", "teen", "adult", "senior"],
      badge_type: [
        "beginner_unlocked",
        "module_completed",
        "quiz_master",
        "weekend_warrior",
      ],
      lesson_difficulty: ["beginner", "intermediate", "advanced"],
    },
  },
} as const

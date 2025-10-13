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
      achievements: {
        Row: {
          badge_name: string
          category: string
          description: string | null
          earned_at: string
          icon: string | null
          id: string
          is_locked: boolean
          user_id: string
        }
        Insert: {
          badge_name: string
          category: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          is_locked?: boolean
          user_id: string
        }
        Update: {
          badge_name?: string
          category?: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          is_locked?: boolean
          user_id?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          approval_level: string
          approver_id: string
          comments: string | null
          created_at: string
          id: string
          processed_at: string | null
          status: Database["public"]["Enums"]["approval_status"]
          team_id: string
        }
        Insert: {
          approval_level: string
          approver_id: string
          comments?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          team_id: string
        }
        Update: {
          approval_level?: string
          approver_id?: string
          comments?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_stats: {
        Row: {
          coding_streak: number
          created_at: string
          daily_increase: number
          date: string
          id: string
          last_activity_at: string | null
          platform: string
          rank_in_section: number | null
          rank_in_team: number | null
          total_solved: number
          updated_at: string
          user_id: string
        }
        Insert: {
          coding_streak?: number
          created_at?: string
          daily_increase?: number
          date?: string
          id?: string
          last_activity_at?: string | null
          platform: string
          rank_in_section?: number | null
          rank_in_team?: number | null
          total_solved?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          coding_streak?: number
          created_at?: string
          daily_increase?: number
          date?: string
          id?: string
          last_activity_at?: string | null
          platform?: string
          rank_in_section?: number | null
          rank_in_team?: number | null
          total_solved?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          hod_id: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          hod_id?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          hod_id?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          achievements: string | null
          created_at: string
          degree: string
          end_year: number | null
          field: string | null
          id: string
          institution: string
          percentage_cgpa: number | null
          start_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string | null
          created_at?: string
          degree: string
          end_year?: number | null
          field?: string | null
          id?: string
          institution: string
          percentage_cgpa?: number | null
          start_year: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string | null
          created_at?: string
          degree?: string
          end_year?: number | null
          field?: string | null
          id?: string
          institution?: string
          percentage_cgpa?: number | null
          start_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          position: string
          skills_used: string[] | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          position: string
          skills_used?: string[] | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          position?: string
          skills_used?: string[] | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_profiles: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean
          last_updated: string | null
          platform: string
          profile_url: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean
          last_updated?: string | null
          platform: string
          profile_url?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean
          last_updated?: string | null
          platform?: string
          profile_url?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_year: string | null
          avatar_url: string | null
          bio: string | null
          cgpa: number | null
          created_at: string
          date_of_birth: string | null
          department_id: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          roll_number: string | null
          section_id: string | null
          semester: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          avatar_url?: string | null
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          roll_number?: string | null
          section_id?: string | null
          semester?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_year?: string | null
          avatar_url?: string | null
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          roll_number?: string | null
          section_id?: string | null
          semester?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          academic_year: string
          advisor_id: string | null
          code: string
          created_at: string
          department_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          advisor_id?: string | null
          code: string
          created_at?: string
          department_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          advisor_id?: string | null
          code?: string
          created_at?: string
          department_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          level: string | null
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          level?: string | null
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          level?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          academic_year: string
          created_at: string
          current_count: number
          department_id: string
          description: string | null
          id: string
          max_members: number
          name: string
          section_id: string
          status: Database["public"]["Enums"]["team_status"]
          team_lead_id: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          current_count?: number
          department_id: string
          description?: string | null
          id?: string
          max_members?: number
          name: string
          section_id: string
          status?: Database["public"]["Enums"]["team_status"]
          team_lead_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          current_count?: number
          department_id?: string
          description?: string | null
          id?: string
          max_members?: number
          name?: string
          section_id?: string
          status?: Database["public"]["Enums"]["team_status"]
          team_lead_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          daily_reports: boolean
          email_notifications: boolean
          id: string
          privacy_level: string
          updated_at: string
          user_id: string
          weekly_reports: boolean
          whatsapp_notifications: boolean
        }
        Insert: {
          created_at?: string
          daily_reports?: boolean
          email_notifications?: boolean
          id?: string
          privacy_level?: string
          updated_at?: string
          user_id: string
          weekly_reports?: boolean
          whatsapp_notifications?: boolean
        }
        Update: {
          created_at?: string
          daily_reports?: boolean
          email_notifications?: boolean
          id?: string
          privacy_level?: string
          updated_at?: string
          user_id?: string
          weekly_reports?: boolean
          whatsapp_notifications?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_department_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_current_user_section_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_team_lead: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      user_is_in_same_team: {
        Args: { _target_user_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      team_status: "pending" | "approved" | "active" | "inactive"
      user_role: "student" | "team_lead" | "advisor" | "hod" | "admin"
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
      approval_status: ["pending", "approved", "rejected"],
      team_status: ["pending", "approved", "active", "inactive"],
      user_role: ["student", "team_lead", "advisor", "hod", "admin"],
    },
  },
} as const

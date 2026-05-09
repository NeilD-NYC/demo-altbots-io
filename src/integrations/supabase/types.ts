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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_activity_log: {
        Row: {
          agent_key: string | null
          created_at: string
          entity_id: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["agent_status"] | null
        }
        Insert: {
          agent_key?: string | null
          created_at?: string
          entity_id: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["agent_status"] | null
        }
        Update: {
          agent_key?: string | null
          created_at?: string
          entity_id?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["agent_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_activity_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      carry_holdings: {
        Row: {
          created_at: string
          entity_id: string
          fund_name: string | null
          hold_period_years: number | null
          id: string
          position_id: string | null
          recharacterization_amount: number | null
          sec_1061_status: Database["public"]["Enums"]["sec_1061_status"] | null
          tax_delta: number | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          fund_name?: string | null
          hold_period_years?: number | null
          id?: string
          position_id?: string | null
          recharacterization_amount?: number | null
          sec_1061_status?:
            | Database["public"]["Enums"]["sec_1061_status"]
            | null
          tax_delta?: number | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          fund_name?: string | null
          hold_period_years?: number | null
          id?: string
          position_id?: string | null
          recharacterization_amount?: number | null
          sec_1061_status?:
            | Database["public"]["Enums"]["sec_1061_status"]
            | null
          tax_delta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carry_holdings_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      chase_emails: {
        Row: {
          body: string | null
          cc_addr: string | null
          created_at: string
          from_addr: string | null
          id: string
          k1_tracking_id: string
          sent_at: string | null
          subject: string | null
          to_addr: string | null
        }
        Insert: {
          body?: string | null
          cc_addr?: string | null
          created_at?: string
          from_addr?: string | null
          id?: string
          k1_tracking_id: string
          sent_at?: string | null
          subject?: string | null
          to_addr?: string | null
        }
        Update: {
          body?: string | null
          cc_addr?: string | null
          created_at?: string
          from_addr?: string | null
          id?: string
          k1_tracking_id?: string
          sent_at?: string | null
          subject?: string | null
          to_addr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chase_emails_k1_tracking_id_fkey"
            columns: ["k1_tracking_id"]
            isOneToOne: false
            referencedRelation: "k1_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      k1_tracking: {
        Row: {
          chase_count: number | null
          created_at: string
          entity_id: string
          expected_date: string | null
          fund_entity_type: string | null
          id: string
          last_chase_date: string | null
          lpa_section_reference: string | null
          manager_name: string | null
          received_date: string | null
          status: Database["public"]["Enums"]["k1_status"] | null
        }
        Insert: {
          chase_count?: number | null
          created_at?: string
          entity_id: string
          expected_date?: string | null
          fund_entity_type?: string | null
          id?: string
          last_chase_date?: string | null
          lpa_section_reference?: string | null
          manager_name?: string | null
          received_date?: string | null
          status?: Database["public"]["Enums"]["k1_status"] | null
        }
        Update: {
          chase_count?: number | null
          created_at?: string
          entity_id?: string
          expected_date?: string | null
          fund_entity_type?: string | null
          id?: string
          last_chase_date?: string | null
          lpa_section_reference?: string | null
          manager_name?: string | null
          received_date?: string | null
          status?: Database["public"]["Enums"]["k1_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "k1_tracking_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      legislative_alerts: {
        Row: {
          applicable_entities: string[] | null
          bill_name: string | null
          bill_number: string | null
          created_at: string
          exposure_amount: number | null
          floor_vote_estimate: string | null
          id: string
          last_updated: string | null
          markup_result: string | null
          mitigation_options: Json | null
          severity: string | null
          status: string | null
          summary: string | null
        }
        Insert: {
          applicable_entities?: string[] | null
          bill_name?: string | null
          bill_number?: string | null
          created_at?: string
          exposure_amount?: number | null
          floor_vote_estimate?: string | null
          id?: string
          last_updated?: string | null
          markup_result?: string | null
          mitigation_options?: Json | null
          severity?: string | null
          status?: string | null
          summary?: string | null
        }
        Update: {
          applicable_entities?: string[] | null
          bill_name?: string | null
          bill_number?: string | null
          created_at?: string
          exposure_amount?: number | null
          floor_vote_estimate?: string | null
          id?: string
          last_updated?: string | null
          markup_result?: string | null
          mitigation_options?: Json | null
          severity?: string | null
          status?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      ppli_compliance_checks: {
        Row: {
          check_type: string | null
          created_at: string
          detail: string | null
          id: string
          irc_section: string | null
          last_run: string | null
          policy_id: string
          result: Database["public"]["Enums"]["compliance_result"] | null
        }
        Insert: {
          check_type?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          irc_section?: string | null
          last_run?: string | null
          policy_id: string
          result?: Database["public"]["Enums"]["compliance_result"] | null
        }
        Update: {
          check_type?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          irc_section?: string | null
          last_run?: string | null
          policy_id?: string
          result?: Database["public"]["Enums"]["compliance_result"] | null
        }
        Relationships: [
          {
            foreignKeyName: "ppli_compliance_checks_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "ppli_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      ppli_policies: {
        Row: {
          broker_contact: string | null
          broker_name: string | null
          carrier_name: string | null
          cash_value: number | null
          created_at: string
          dac_tax_paid: number | null
          death_benefit: number | null
          diversification_817h_pass: boolean | null
          entity_id: string
          id: string
          idf_domicile: string | null
          idf_holdings_count: number | null
          investor_control_flags: number | null
          issue_date: string | null
          lifetime_pv_shield: number | null
          max_position_pct: number | null
          me_charges_bps: number | null
          mec_status: Database["public"]["Enums"]["ppli_mec_status"] | null
          policy_letter: string | null
          premium_year_current: number | null
          premium_years_total: number | null
          state_premium_tax: number | null
          wyden_clawback_high: number | null
          wyden_clawback_low: number | null
          wyden_risk_level:
            | Database["public"]["Enums"]["ppli_wyden_risk"]
            | null
        }
        Insert: {
          broker_contact?: string | null
          broker_name?: string | null
          carrier_name?: string | null
          cash_value?: number | null
          created_at?: string
          dac_tax_paid?: number | null
          death_benefit?: number | null
          diversification_817h_pass?: boolean | null
          entity_id: string
          id?: string
          idf_domicile?: string | null
          idf_holdings_count?: number | null
          investor_control_flags?: number | null
          issue_date?: string | null
          lifetime_pv_shield?: number | null
          max_position_pct?: number | null
          me_charges_bps?: number | null
          mec_status?: Database["public"]["Enums"]["ppli_mec_status"] | null
          policy_letter?: string | null
          premium_year_current?: number | null
          premium_years_total?: number | null
          state_premium_tax?: number | null
          wyden_clawback_high?: number | null
          wyden_clawback_low?: number | null
          wyden_risk_level?:
            | Database["public"]["Enums"]["ppli_wyden_risk"]
            | null
        }
        Update: {
          broker_contact?: string | null
          broker_name?: string | null
          carrier_name?: string | null
          cash_value?: number | null
          created_at?: string
          dac_tax_paid?: number | null
          death_benefit?: number | null
          diversification_817h_pass?: boolean | null
          entity_id?: string
          id?: string
          idf_domicile?: string | null
          idf_holdings_count?: number | null
          investor_control_flags?: number | null
          issue_date?: string | null
          lifetime_pv_shield?: number | null
          max_position_pct?: number | null
          me_charges_bps?: number | null
          mec_status?: Database["public"]["Enums"]["ppli_mec_status"] | null
          policy_letter?: string | null
          premium_year_current?: number | null
          premium_years_total?: number | null
          state_premium_tax?: number | null
          wyden_clawback_high?: number | null
          wyden_clawback_low?: number | null
          wyden_risk_level?:
            | Database["public"]["Enums"]["ppli_wyden_risk"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "ppli_policies_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      residency_days: {
        Row: {
          created_at: string
          date: string
          entity_id: string
          id: string
          location_city: string | null
          location_state: string | null
          source: Database["public"]["Enums"]["residency_source"] | null
        }
        Insert: {
          created_at?: string
          date: string
          entity_id: string
          id?: string
          location_city?: string | null
          location_state?: string | null
          source?: Database["public"]["Enums"]["residency_source"] | null
        }
        Update: {
          created_at?: string
          date?: string
          entity_id?: string
          id?: string
          location_city?: string | null
          location_state?: string | null
          source?: Database["public"]["Enums"]["residency_source"] | null
        }
        Relationships: [
          {
            foreignKeyName: "residency_days_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      residency_kpis: {
        Row: {
          audit_win_probability: number | null
          ca_days: number | null
          created_at: string
          domicile_factors_weak: Json | null
          entity_id: string
          fl_days: number | null
          id: string
          international_days: number | null
          ny_days: number | null
          nyc_days: number | null
          year: number
        }
        Insert: {
          audit_win_probability?: number | null
          ca_days?: number | null
          created_at?: string
          domicile_factors_weak?: Json | null
          entity_id: string
          fl_days?: number | null
          id?: string
          international_days?: number | null
          ny_days?: number | null
          nyc_days?: number | null
          year: number
        }
        Update: {
          audit_win_probability?: number | null
          ca_days?: number | null
          created_at?: string
          domicile_factors_weak?: Json | null
          entity_id?: string
          fl_days?: number | null
          id?: string
          international_days?: number | null
          ny_days?: number | null
          nyc_days?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "residency_kpis_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          contact_name: string | null
          created_at: string
          entity_id: string
          firm_name: string | null
          id: string
          last_contact_date: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          entity_id: string
          firm_name?: string | null
          id?: string
          last_contact_date?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          entity_id?: string
          firm_name?: string | null
          id?: string
          last_contact_date?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      structural_flags: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          due_date: string | null
          entity_id: string
          flag_type: Database["public"]["Enums"]["flag_type"] | null
          id: string
          irc_citation: string | null
          severity: Database["public"]["Enums"]["flag_severity"] | null
          title: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id: string
          flag_type?: Database["public"]["Enums"]["flag_type"] | null
          id?: string
          irc_citation?: string | null
          severity?: Database["public"]["Enums"]["flag_severity"] | null
          title?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id?: string
          flag_type?: Database["public"]["Enums"]["flag_type"] | null
          id?: string
          irc_citation?: string | null
          severity?: Database["public"]["Enums"]["flag_severity"] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "structural_flags_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_calendar: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string
          description: string | null
          entity_id: string
          event_date: string | null
          id: string
          severity: string | null
          title: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          entity_id: string
          event_date?: string | null
          id?: string
          severity?: string | null
          title?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string
          event_date?: string | null
          id?: string
          severity?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_calendar_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_entities: {
        Row: {
          aum: number | null
          created_at: string
          entity_name: string
          entity_type: Database["public"]["Enums"]["tax_entity_type"]
          id: string
          primary_residency_state: string | null
          secondary_residency_state: string | null
          tax_year: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aum?: number | null
          created_at?: string
          entity_name: string
          entity_type: Database["public"]["Enums"]["tax_entity_type"]
          id?: string
          primary_residency_state?: string | null
          secondary_residency_state?: string | null
          tax_year?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aum?: number | null
          created_at?: string
          entity_name?: string
          entity_type?: Database["public"]["Enums"]["tax_entity_type"]
          id?: string
          primary_residency_state?: string | null
          secondary_residency_state?: string | null
          tax_year?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_kpis: {
        Row: {
          created_at: string
          entity_id: string
          exemption_remaining: number | null
          exemption_used: number | null
          fed_tax_ytd: number | null
          harvest_available: number | null
          harvest_tax_savings: number | null
          id: string
          ny_days_limit: number | null
          ny_days_ytd: number | null
          ppli_cash_value: number | null
          snapshot_date: string
          tax_alpha_ytd: number | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          exemption_remaining?: number | null
          exemption_used?: number | null
          fed_tax_ytd?: number | null
          harvest_available?: number | null
          harvest_tax_savings?: number | null
          id?: string
          ny_days_limit?: number | null
          ny_days_ytd?: number | null
          ppli_cash_value?: number | null
          snapshot_date: string
          tax_alpha_ytd?: number | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          exemption_remaining?: number | null
          exemption_used?: number | null
          fed_tax_ytd?: number | null
          harvest_available?: number | null
          harvest_tax_savings?: number | null
          id?: string
          ny_days_limit?: number | null
          ny_days_ytd?: number | null
          ppli_cash_value?: number | null
          snapshot_date?: string
          tax_alpha_ytd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_kpis_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "tax_entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_entity: { Args: { _entity_id: string }; Returns: boolean }
    }
    Enums: {
      agent_status: "ok" | "warn" | "info" | "alert"
      compliance_result: "pass" | "fail" | "flag"
      flag_severity: "red" | "amber" | "green" | "info"
      flag_type:
        | "pfic"
        | "qsbs"
        | "ubti"
        | "niit"
        | "ftc"
        | "wash_sale"
        | "salt_ptet"
        | "daf_crt"
        | "trust_situs"
        | "gst"
        | "sec_754"
      k1_status: "received" | "pending" | "overdue" | "amended"
      ppli_mec_status: "safe" | "watch" | "mec"
      ppli_wyden_risk: "low" | "medium" | "high"
      residency_source:
        | "google_calendar"
        | "icloud"
        | "netjets"
        | "amex_geo"
        | "manual"
      sec_1061_status: "pass" | "watch" | "fail"
      tax_entity_type: "family_office" | "foundation" | "endowment" | "pension"
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
      agent_status: ["ok", "warn", "info", "alert"],
      compliance_result: ["pass", "fail", "flag"],
      flag_severity: ["red", "amber", "green", "info"],
      flag_type: [
        "pfic",
        "qsbs",
        "ubti",
        "niit",
        "ftc",
        "wash_sale",
        "salt_ptet",
        "daf_crt",
        "trust_situs",
        "gst",
        "sec_754",
      ],
      k1_status: ["received", "pending", "overdue", "amended"],
      ppli_mec_status: ["safe", "watch", "mec"],
      ppli_wyden_risk: ["low", "medium", "high"],
      residency_source: [
        "google_calendar",
        "icloud",
        "netjets",
        "amex_geo",
        "manual",
      ],
      sec_1061_status: ["pass", "watch", "fail"],
      tax_entity_type: ["family_office", "foundation", "endowment", "pension"],
    },
  },
} as const

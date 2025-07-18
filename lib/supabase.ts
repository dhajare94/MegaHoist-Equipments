import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          password: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          image_url: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          description?: string
          created_at?: string
        }
      }
      spare_parts: {
        Row: {
          id: string
          name: string
          image_url: string
          unit: string
          price: number
          description: string
          product_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          unit: string
          price: number
          description?: string
          product_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          unit?: string
          price?: number
          description?: string
          product_id?: string | null
          created_at?: string
        }
      }
      enquiries: {
        Row: {
          id: string
          spare_part_id: string
          quantity: number
          unit: string
          additional: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          spare_part_id: string
          quantity: number
          unit: string
          additional?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          spare_part_id?: string
          quantity?: number
          unit?: string
          additional?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
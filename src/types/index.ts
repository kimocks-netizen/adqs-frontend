export interface Article {
  id: string;
  title: string;
  slug: string;
  introduction: string;
  body: string;
  featured_image_url: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  hidden?: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  display_order: number;
  is_active: boolean;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  area_of_enquiry: string;
  message: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  document_type: 'invoice' | 'quote';
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  matter_reference?: string;
  invoice_date: string;
  due_date?: string;
  subtotal: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  invoice_items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  external_url: string;
  tags: string[];
  year: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  media?: ProjectMedia[];
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  url: string;
  media_type: 'image' | 'video';
  caption: string;
  is_primary: boolean;
  order_index: number;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  created_at: string;
}

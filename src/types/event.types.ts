export interface EventFormData {
  title: string;
  phoneNumber: string;
  dateTime: string;
  location: string;
  costPerPerson: string;
  description: string;
  flyerImageUrl?: string;
  backgroundImageUrl?: string;
  draftId?: string;
}

export interface ImageData {
  url: string;
  fileId: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

export interface EventResponse {
  success: boolean;
  message?: string;
  draftId?: string;
  eventId?: string;
  eventUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}


export interface Paper {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  pdfUrl: string;
  filename: string;
  fileSize: number;
  pageCount: number;
  uploadTimestamp: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CroppedImage {
  dataUrl: string;
  filename: string;
  date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

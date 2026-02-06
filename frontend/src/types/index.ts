export interface Paper {
    id: string;
    date: string;
    title: string;
    filename: string;
    pdfUrl: string;
    fileSize: number;
    pageCount: number;
    uploadTimestamp: number;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl: string | null;
    pages?: { highQuality: string; standard: string; thumbnail: string }[];
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface User {
    id: number;
    email: string;
    role: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

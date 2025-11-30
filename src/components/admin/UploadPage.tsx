import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft,
  Image
} from 'lucide-react';
import { paperAPI } from '../../services/api';
import { UploadProgress } from '../../types';
import { getTodayDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);

      // Auto-generate title if not set
      if (!title) {
        const fileName = file.name.replace('.pdf', '');
        setTitle(`Telugu E-Paper - ${new Date(date).toLocaleDateString()}`);
      }
    }
  }, [title, date]);

  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
        toast.error('Image file size must be less than 10MB');
        return;
      }

      setSelectedThumbnail(file);

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnailPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress({ loaded: 0, total: selectedFile.size, percentage: 0 });

      const response = await paperAPI.uploadWithThumbnail(
        selectedFile,
        date,
        title.trim(),
        selectedThumbnail || undefined,
        (progress) => setUploadProgress(progress)
      );

      if (response.success) {
        toast.success('Paper uploaded successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload paper');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(null);
  };

  const removeThumbnail = () => {
    setSelectedThumbnail(null);
    setThumbnailPreview(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center text-telugu-primary hover:text-telugu-secondary mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900">Upload New Paper</h1>
        <p className="text-gray-600 mt-2">
          Upload a new Telugu newspaper edition in PDF format
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            PDF File
          </label>

          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-telugu-primary bg-telugu-primary/5'
                  : 'border-gray-300 hover:border-telugu-primary hover:bg-gray-50'
                }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />

              {isDragActive ? (
                <p className="text-telugu-primary font-medium">
                  Drop the PDF file here...
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop a PDF file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 50MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                {!uploading && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {uploadProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-telugu-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Thumbnail Image (Optional)
          </label>

          {!selectedThumbnail ? (
            <div
              {...getThumbnailRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isThumbnailDragActive
                  ? 'border-telugu-primary bg-telugu-primary/5'
                  : 'border-gray-300 hover:border-telugu-primary hover:bg-gray-50'
                }`}
            >
              <input {...getThumbnailInputProps()} />
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />

              {isThumbnailDragActive ? (
                <p className="text-telugu-primary font-medium">
                  Drop the image here...
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-20 w-20 object-cover rounded border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedThumbnail.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedThumbnail.size)}
                    </p>
                  </div>
                </div>

                {!uploading && (
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Paper Details</h3>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g., Telugu E-Paper - Daily Edition"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Edition Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Upload high-quality PDF files for better reading experience
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Ensure the PDF is properly formatted and readable
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Papers older than 7 days will be automatically deleted
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Maximum file size is 50MB per upload
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!selectedFile || uploading || !title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Paper
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
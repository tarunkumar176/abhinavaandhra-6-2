import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  Crop
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { Paper } from '../../../types';
import { paperAPI } from '../../services/api';
import { formatDisplayDate, getRecentDates, formatLongDate } from '../../utils/dateUtils';
import { addWatermarkToImage, downloadImage } from '../../utils/imageUtils';
import toast from 'react-hot-toast';


const PaperView: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const cropperRef = React.useRef<any>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Set PDF.js worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    if (date) {
      fetchPaper(date);
    }
  }, [date]);

  const fetchPaper = async (paperDate: string) => {
    try {
      setLoading(true);

      // First get basic paper info
      const paperResponse = await paperAPI.getByDate(paperDate);
      if (paperResponse.success && paperResponse.data) {
        setPaper(paperResponse.data);

        // Check if we have pre-processed pages (server-side processing)
        if (paperResponse.data.pages && paperResponse.data.pages.length > 0) {
          console.log('✅ Using pre-processed server images');
          const images = paperResponse.data.pages.map(p => p.highQuality);
          setPageImages(images);
          setTotalPages(images.length);
          // Set current page to 0 if not already
          setCurrentPage(0);
        } else {
          console.log('⚠️ No server images found, falling back to client-side rendering');
          // Fallback: use the original PDF with optimized PDF.js rendering
          await renderPdfToImages(paperResponse.data.pdfUrl);
        }
      } else {
        toast.error('Paper not found for this date');
      }
    } catch (error) {
      toast.error('Failed to fetch paper');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pageImages.length - 1) {
      setCurrentPage(currentPage + 1);
      console.log(`📄 Navigated to page ${currentPage + 2}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      console.log(`📄 Navigated to page ${currentPage}`);
    }
  };

  const getCurrentPageImage = () => {
    const image = pageImages[currentPage];
    console.log(`🖼️ Getting image for page ${currentPage + 1}:`, image ? 'Found' : 'Not found');
    return image;
  };

  const renderPdfToImages = async (pdfUrl: string) => {
    try {
      // Convert full URL to relative for proxy
      const proxyUrl = pdfUrl.replace('http://localhost:5000', '');
      console.log('🔄 Loading PDF:', proxyUrl);
      setPdfLoading(true);
      setPageImages([]); // Clear existing images
      setCurrentPage(0); // Reset to first page

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({
        url: proxyUrl,
        cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      }).promise;

      console.log(`📄 PDF loaded with ${pdf.numPages} pages`);
      setTotalPages(pdf.numPages);

      // Load ALL pages sequentially for now (simpler approach)
      const allImages: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`🖼️ Loading page ${pageNum}/${pdf.numPages}...`);

        const page = await pdf.getPage(pageNum);
        const scale = pageNum === 1 ? 2.5 : 2.0; // High quality for first page
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Convert to image
          const imageData = canvas.toDataURL('image/png');
          allImages.push(imageData);

          console.log(`✅ Page ${pageNum} loaded successfully`);

          // Update state after each page loads
          setPageImages([...allImages]);

          // Stop loading indicator after first page
          if (pageNum === 1) {
            setPdfLoading(false);
          }
        }
      }

      console.log(`🎉 All ${pdf.numPages} pages loaded successfully`);

    } catch (error) {
      console.error('❌ Error rendering PDF:', error);
      toast.error('Failed to render PDF pages');
      setPdfLoading(false);
    }
  };

  const loadPage = async (pdf: any, pageNum: number, highQuality = false) => {
    try {
      console.log(`📄 Loading page ${pageNum} (${highQuality ? 'high' : 'standard'} quality)...`);

      const page = await pdf.getPage(pageNum);

      // Use higher scale for better quality
      const scale = highQuality ? 2.5 : 2.0;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('❌ Failed to get canvas context');
        return null;
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Use WebP for better compression, fallback to PNG
      let imageData;
      try {
        const quality = highQuality ? 0.95 : 0.85;
        imageData = canvas.toDataURL('image/webp', quality);
      } catch (webpError) {
        // Fallback to PNG if WebP not supported
        imageData = canvas.toDataURL('image/png');
      }

      console.log(`✅ Page ${pageNum} loaded successfully`);
      return imageData;
    } catch (error) {
      console.error(`❌ Error loading page ${pageNum}:`, error);
      return null;
    }
  };

  const loadRemainingPages = async (pdf: any) => {
    const allImages = [...pageImages]; // Start with current images

    // Load remaining pages
    for (let pageNum = 2; pageNum <= pdf.numPages; pageNum++) {
      const imageData = await loadPage(pdf, pageNum, false);
      if (imageData) {
        allImages.push(imageData);
        setPageImages([...allImages]); // Update state as pages load
      }

      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 100));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
  };

  const handleScreenshot = async () => {
    if (!paper) return;

    try {
      let imageUrl: string;

      if (cropMode && cropperRef.current && cropperRef.current.cropper) {
        const cropper = cropperRef.current.cropper;
        // Get cropped canvas directly
        imageUrl = cropper.getCroppedCanvas().toDataURL('image/png');
      } else {
        // Full page screenshot - use the current page image
        imageUrl = pageImages[currentPage];
      }

      const watermarkedImage = await addWatermarkToImage(
        imageUrl,
        formatLongDate(paper.date),
        '/logo-watermark.jpg'
      );

      downloadImage(watermarkedImage);
      toast.success('Screenshot saved!');
      setCropMode(false);
    } catch (error) {
      console.error('Screenshot failed:', error);
      toast.error('Failed to take screenshot');
    }
  };

  const toggleCropMode = () => {
    setCropMode(!cropMode);
    setZoom(100); // Reset zoom when entering crop mode
  };

  const recentDates = getRecentDates(7);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telugu-primary"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Paper Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">
            No newspaper is available for {date ? formatDisplayDate(date) : 'this date'}.
          </p>
          <Link to="/" className="inline-flex items-center justify-center btn-primary gap-2 hover:shadow-lg">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-6">
        <div className="flex-1 min-w-0">
          <Link to="/" className="inline-flex items-center text-telugu-primary hover:text-telugu-secondary mb-2 text-xs sm:text-sm md:text-base transition">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 flex-shrink-0" />
            <span className="truncate">Back to Home</span>
          </Link>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 break-words mb-1 sm:mb-2">{paper.title}</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">{formatDisplayDate(paper.date)}</p>
        </div>
      </div>

      {/* PDF Viewer as Images */}
      <div className="card p-2 sm:p-3 md:p-4 lg:p-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-5 border rounded-lg bg-gray-50">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-grow sm:flex-grow-0 justify-center sm:justify-start order-1">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="p-1.5 sm:p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 border sm:border-0 border-gray-200"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <span className="text-xs sm:text-sm md:text-base font-medium min-w-[60px] sm:min-w-[80px] md:min-w-[100px] text-center">
              {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : 'Loading...'}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= pageImages.length - 1}
              className="p-1.5 sm:p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 border sm:border-0 border-gray-200"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-grow sm:flex-grow-0 justify-center sm:justify-end order-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1.5 sm:p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <span className="text-xs sm:text-sm md:text-base font-medium min-w-[40px] sm:min-w-[50px] md:min-w-[70px] text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 100}
              className="p-1.5 sm:p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 sm:mx-2"></div>

            <button
              onClick={toggleCropMode}
              className={`p-1.5 sm:p-2 rounded transition active:scale-95 ${cropMode
                ? 'bg-telugu-primary text-white shadow-md'
                : 'hover:bg-gray-200 text-gray-700'
                }`}
              title="Toggle Crop Mode"
            >
              <Crop className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>

            {cropMode && (
              <>
                <button
                  onClick={handleScreenshot}
                  className="p-1.5 sm:p-2 rounded bg-green-600 text-white hover:bg-green-700 transition active:scale-95"
                  title="Save Crop"
                >
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={() => setCropMode(false)}
                  className="p-1.5 sm:p-2 rounded bg-red-500 text-white hover:bg-red-600 transition active:scale-95"
                  title="Cancel Crop"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Page Display - White Background */}
        <div
          className="relative flex justify-center items-center bg-white rounded-lg p-1 sm:p-3 md:p-4 group min-h-[50vh] sm:min-h-[60vh]"
          style={{
            minHeight: 'clamp(300px, 60vh, 900px)',
          }}
        >
          {/* Left Arrow (Desktop Only) */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="hidden sm:block fixed left-2 sm:left-4 text-gray-700 p-2 sm:p-3 rounded-full transition z-10 bg-gray-200/80 hover:bg-gray-300/90 disabled:bg-gray-100/50 disabled:cursor-not-allowed shadow-md"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            title="Previous page"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Right Arrow (Desktop Only) */}
          <button
            onClick={goToNextPage}
            disabled={currentPage >= pageImages.length - 1}
            className="hidden sm:block fixed right-2 sm:right-4 text-gray-700 p-2 sm:p-3 rounded-full transition z-10 bg-gray-200/80 hover:bg-gray-300/90 disabled:bg-gray-100/50 disabled:cursor-not-allowed shadow-md"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            title="Next page"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {pdfLoading ? (
            <div className="flex flex-col items-center justify-center h-64 sm:h-96 text-gray-700">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-telugu-primary mb-4"></div>
              <p className="text-sm sm:text-base">Loading high-quality pages...</p>
            </div>
          ) : getCurrentPageImage() ? (
            cropMode ? (
              <div style={{ width: '100%', height: '80vh' }}>
                <Cropper
                  ref={cropperRef}
                  style={{ height: '100%', width: '100%' }}
                  initialAspectRatio={NaN}
                  src={getCurrentPageImage()}
                  viewMode={1}
                  guides={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={0.8}
                  checkOrientation={false}
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  ref={imageRef}
                  src={getCurrentPageImage()}
                  alt={`Page ${currentPage + 1}`}
                  style={{ width: `${zoom}%`, height: 'auto' }}
                  className="rounded shadow-lg"
                  loading="eager"
                />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-96 text-gray-400">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
                <p className="text-sm sm:text-base">Loading page {currentPage + 1}...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="card p-2 sm:p-3 md:p-4 lg:p-5">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Other Editions</h3>
        <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
          {recentDates.map((dateStr) => (
            <Link
              key={dateStr}
              to={`/paper/${dateStr}`}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors ${dateStr === date
                ? 'bg-telugu-primary text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
                }`}
            >
              {formatDisplayDate(dateStr)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperView;
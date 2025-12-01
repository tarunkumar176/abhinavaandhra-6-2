import html2canvas from 'html2canvas';
import { CropArea, CroppedImage } from '../../types';

export const addWatermarkToImage = async (
  imageUrl: string,
  date: string,
  logoUrl?: string
): Promise<CroppedImage> => {
  try {
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    // We don't set fixed width/height yet, we'll let the content dictate it
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = 'Noto Sans Telugu, sans-serif';

    document.body.appendChild(tempContainer);

    // Add header with logo
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    header.style.borderBottom = '2px solid #d97706';
    header.style.paddingBottom = '10px';
    header.style.width = '100%';
    header.style.display = 'flex';
    header.style.justifyContent = 'center';
    header.style.alignItems = 'center';

    if (logoUrl) {
      const logo = document.createElement('img');
      logo.src = logoUrl;
      logo.style.height = '100px';
      logo.style.objectFit = 'contain';
      header.appendChild(logo);
    } else {
      const logoText = document.createElement('h2');
      logoText.textContent = 'Telugu E-Paper';
      logoText.style.color = '#d97706';
      logoText.style.margin = '0';
      logoText.style.fontSize = '24px';
      logoText.style.fontWeight = 'bold';
      header.appendChild(logoText);
    }

    tempContainer.appendChild(header);

    // Add image content
    const contentContainer = document.createElement('div');
    const image = document.createElement('img');
    image.src = imageUrl;
    image.style.maxWidth = '100%';
    image.style.display = 'block';

    // Wait for image to load
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    contentContainer.appendChild(image);
    tempContainer.appendChild(contentContainer);

    // Add footer with date
    const footer = document.createElement('div');
    footer.style.textAlign = 'center';
    footer.style.marginTop = '20px';
    footer.style.borderTop = '1px solid #d97706';
    footer.style.paddingTop = '10px';
    footer.style.fontSize = '14px';
    footer.style.color = '#666';
    footer.textContent = `Edition Date: ${date}`;

    tempContainer.appendChild(footer);

    // Convert to canvas
    const canvas = await html2canvas(tempContainer, {
      backgroundColor: 'white',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    // Clean up
    document.body.removeChild(tempContainer);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const filename = `telugu-epaper-${date}-${Date.now()}.jpg`;

    return {
      dataUrl,
      filename,
      date,
    };
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw new Error('Failed to add watermark');
  }
};

export const downloadImage = (croppedImage: CroppedImage): void => {
  const link = document.createElement('a');
  link.href = croppedImage.dataUrl;
  link.download = croppedImage.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
// Helper to generate optimized Cloudinary URLs and simulate uploads if credentials are not configured.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

// Beautiful placeholder hair images for local development fallback
const HAIR_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1595959183075-c1d0a7793c27?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
];

export const cloudinaryService = {
  /**
   * Upload an image to Cloudinary (or fallback mock)
   */
  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      console.warn(
        'Cloudinary credentials not configured. Using high-quality unsplash mock image.'
      );
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const randomIdx = Math.floor(Math.random() * HAIR_PLACEHOLDERS.length);
      const randomId = Math.random().toString(36).substring(7);
      
      return {
        url: HAIR_PLACEHOLDERS[randomIdx],
        publicId: `mock_hair_${randomId}`,
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      // Optional: enforce compression, WebP conversion at ingest
      formData.append('folder', 'hairhub_india');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },

  /**
   * Get an optimized/transformed Cloudinary URL
   * E.g. webp conversion, compression, width-sizing
   */
  getOptimizedUrl: (url: string, publicId: string, options: { width?: number; height?: number; crop?: string } = {}) => {
    // If it's a mock image, we just append width/height queries if unsplash supports them
    if (publicId.startsWith('mock_')) {
      if (options.width || options.height) {
        let cleanUrl = url.split('&w=')[0].split('&h=')[0];
        if (options.width) cleanUrl += `&w=${options.width}`;
        if (options.height) cleanUrl += `&h=${options.height}`;
        return cleanUrl;
      }
      return url;
    }

    if (!CLOUD_NAME) return url;

    // Build Cloudinary URL structure:
    // https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/v1/<public_id>
    const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
    const transformations: string[] = ['f_auto', 'q_auto']; // Format auto (WebP/AVIF), Quality auto

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);

    const transString = transformations.join(',');
    return `${base}/${transString}/${publicId}`;
  },

  /**
   * Delete an image from Cloudinary (requires secure server endpoint, so we usually just skip in frontend mock)
   */
  deleteImage: async (publicId: string): Promise<boolean> => {
    console.log(`Requested deleting image: ${publicId}`);
    return true;
  },
};

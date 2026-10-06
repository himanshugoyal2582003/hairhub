import { Request, Response } from 'express';
import multer from 'multer';
import { uploadBuffer } from '../config/cloudinary';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// POST /api/upload — upload single image
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const result = await uploadBuffer(req.file.buffer);
    res.json({ url: result.url, publicId: result.publicId });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

// POST /api/upload/multiple — upload up to 5 images
export const uploadMultiple = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const results = await Promise.all(files.map((f) => uploadBuffer(f.buffer)));
    res.json({
      images: results.map((r) => ({ url: r.url, publicId: r.publicId })),
    });
  } catch (err) {
    console.error('Multiple upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

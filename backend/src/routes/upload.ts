import { Router } from 'express';
import { upload, uploadImage, uploadMultiple } from '../controllers/uploadController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, upload.single('file'), uploadImage);
router.post('/multiple', protect, upload.array('files', 5), uploadMultiple);

export default router;

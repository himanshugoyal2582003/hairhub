import { Router } from 'express';
import {
  getListings, getListing, createListing,
  updateListing, deleteListing, getUserListings, updateStatus, getPublicStats,
} from '../controllers/listingController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/stats', getPublicStats);
router.get('/', getListings);
router.get('/my', protect, getUserListings);
router.get('/:id', getListing);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.patch('/:id/status', protect, updateStatus);

export default router;

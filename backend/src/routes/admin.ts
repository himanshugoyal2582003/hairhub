import { Router } from 'express';
import { getStats, getAllListings, moderateListing, getUsers, updateUserRole, removeListingImage, deleteUser } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/listings', getAllListings);
router.patch('/listings/:id', moderateListing);
router.patch('/listings/:id/remove-image', removeListingImage);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;


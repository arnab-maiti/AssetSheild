import {updateAssetStatusController} from '../controllers/updateStatus.controller.js';
import express from 'express';
const router = express.Router();

router.patch('/:id/status', updateAssetStatusController);
export default router;
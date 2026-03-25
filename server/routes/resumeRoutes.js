import express from 'express'
import protect from '../middlewares/authMiddleware.js';
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from '../controllers/resumeController.js';
import upload from '../configs/Multer.js';

const resumeRouter=express.Router();

resumeRouter.post('/create',protect,createResume)
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
resumeRouter.get('/public/:resumeId',getPublicResumeById);
resumeRouter.get('/get/:resumeId',protect,getResumeById);
resumeRouter.get('/:resumeId',protect,getResumeById);

export default resumeRouter;




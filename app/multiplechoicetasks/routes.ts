import express from 'express';

import { Post, Get, Put, Delete, GetCollection, PostCollection } from './controller';

const router: express.Router = express.Router();

router.get('/', GetCollection);
router.post('/', Post);
router.post('/collection', PostCollection);
router.get('/:id', Get);
router.put('/:id', Put);
router.delete('/:id', Delete)
export default router;
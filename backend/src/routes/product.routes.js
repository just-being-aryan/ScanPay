import express from 'express'

import {validateBarcode,validateArticle} from '../controllers/product.controller.js'

const router = express.Router();

router.get('./barcode/:code', validateBarcode);
router.get('./article/:articleName', validateArticle);

export default router;


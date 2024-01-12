import express from "express";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFilterController, productListController, productPhotoController, searchProductController, updateProductController } from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);

router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);

router.get('/get-product',getProductController);

router.get('/get-product/:slug',getSingleProductController);

router.get('/product-photo/:pid',productPhotoController);

router.delete('/delete-product/:pid',deleteProductController);

router.post('/product-filter',productFilterController)

router.get("/product-count", productCountController);

router.get('/product-list/:page',productListController)

router.get("/search/:keyword", searchProductController);

export default router;
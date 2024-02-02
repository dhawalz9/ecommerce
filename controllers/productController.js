import fs from 'fs'
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js'
import slugify from 'slugify';

export const createProductController = async(req,res)=>{
    try {
        const {name,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        // validation
        switch (true) {
            case !name:
                return res.status(500).send({error:"Name is required"})
            case !description:
                return res.status(500).send({error:"Description is required"})
            case !price:    
                return res.status(500).send({error:"Price is required"})
            case !category:
                return res.status(500).send({error:"Category is required"})
            case !quantity:
                return res.status(500).send({error:"Quantity is required"})
            case !photo && photo.size>100000:
                return res.status(500).send({error:"Photo is required anf should be less than 1mb"})
            
        }

        const product = new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success:true,
            message:'Product created successfully',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in creating product"
        });
    }
}

export const getProductController = async(req,res)=>{
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            total_count:products.length,
            message:'All products',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting products"
        });
    }
}

export const getSingleProductController = async(req,res)=>{
    try {
        const product = await productModel.findOne({slug:{$regex:new RegExp(`${req.params.slug}$`,'i')}}).select("-photo").populate('category')
        res.status(200).send({
            success:true,
            message:'Single product fetched',
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting single product"
        });
    }
}


export const productPhotoController = async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-Type',product.photo.contentType)
            console.log(product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting single product"
        });
    }
}

export const deleteProductController = async(req,res)=>{
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:'Product deleted successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in deleting product"
        });
    }
}

export const updateProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } =
        req.fields;
      const { photo } = req.files;
      if (typeof category === 'object' && category !== null) {
        category = category._id; // or some other property that holds the ObjectId
      }
      //validation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Update product",
      });
    }
};

export const productFilterController = async(req,res)=>{
    try {
        const {checked,radio} = req.body
        let args={}
        if(checked.length>0) args.category = checked
        if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.send({
            success:false,
            error,
            message:"Error while filtering products"
        })
    }
}

export const productCountController = async (req, res) => {
    try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 5;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};



export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel.find({category: cid, _id: { $ne: pid }})
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).populate('category')
    res.status(200).send({
      success: true,
      products,
    });
  }
  catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting products",
      error,
    });
  }
}


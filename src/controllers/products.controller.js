import productService from "../services/product.service.js";
import { logger } from "../utils/logger.js";
import errorMessages from "../services/errors/custom-error.js";
import { CreateProductDTO, UpdateProductDTO } from "../dto/products.dto.js";

const handleErrorResponse = (res, error, defaultMessage, statusCode = 500) => {
  const errorMessage =
    errorMessages.productErrors[error.code] || defaultMessage;
  res.status(statusCode).json({ error: errorMessage });
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    handleErrorResponse(res, error, "Error al obtener productos.");
  }
};

const createProduct = async (req, res) => {
  try {
    const createProductDTO = new CreateProductDTO(req.body);
    const newProduct = await productService.addProduct(createProductDTO);
    res.status(201).json(newProduct);
  } catch (error) {
    handleErrorResponse(res, error, "Error al crear producto.", 400);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    handleErrorResponse(res, error, "Producto no encontrado.", 404);
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateProductDTO = new UpdateProductDTO(req.body);
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      updateProductDTO
    );
    res.json(updatedProduct);
  } catch (error) {
    handleErrorResponse(res, error, "Error al actualizar producto.", 400);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    handleErrorResponse(res, error, "Error al eliminar producto.");
  }
};

const getProductsView = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, available } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    };

    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.status = available;

    const products = await productService.getProducts(filter, options);
    const productsData = products.docs.map((doc) => doc.toObject());

    const startPage = Math.max(1, products.prevPage || 1);
    const endPage = Math.min(
      products.totalPages || 1,
      products.nextPage || products.totalPages
    );
    const pagesInRange = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    res.render("home", {
      products: { ...products, docs: productsData },
      pagesInRange,
    });
  } catch (error) {
    logger.error("No se pudieron obtener los productos");
    handleErrorResponse(res, error, "Error al obtener productos.");
  }
};

const getRealTimeProductsView = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    logger.error("No se pudieron obtener los productos en tiempo real");
    handleErrorResponse(
      res,
      error,
      "Error al obtener productos en tiempo real."
    );
  }
};

export default {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsView,
  getRealTimeProductsView,
};

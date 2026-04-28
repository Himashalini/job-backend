import { BookModel } from "../models/book.model.js";

/* ======================================================
   ✅ READ - Get all books
   ====================================================== */
export const getBooks = async (req, res) => {
  try {
    const books = await BookModel.getAll();
    res.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

/* ======================================================
   ✅ CREATE - Add new book (single or multiple images)
   ====================================================== */
export const createBook = async (req, res) => {
  try {
    await BookModel.create(req.body);
    res.status(201).json({
      message: "Book created successfully",
    });
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
    res.status(500).json({
      message: "Failed to create book",
    });
  }
};

/* ======================================================
   ✅ UPDATE - Update book
   Supports:
   - single edit
   - multiple edit
   - append images
   - replace images
   ====================================================== */
export const updateBook = async (req, res) => {
  try {
    await BookModel.update(req.params.id, req.body);
    res.json({
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);
    res.status(400).json({
      message: error.message || "Failed to update book",
    });
  }
};

/* ======================================================
   ✅ DELETE - Delete SINGLE image
   ====================================================== */
export const deleteBookImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        message: "image_url is required",
      });
    }

    await BookModel.deleteImage(id, image_url);

    res.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK IMAGE ERROR:", error);
    res.status(400).json({
      message: error.message || "Failed to delete image",
    });
  }
};

/* ======================================================
   ✅ DELETE - Delete book & ALL images
   ====================================================== */
export const deleteBook = async (req, res) => {
  try {
    await BookModel.delete(req.params.id);
    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    res.status(500).json({
      message: "Failed to delete book",
    });
  }
};
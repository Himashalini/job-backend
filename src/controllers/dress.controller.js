import { DressModel } from "../models/dress.model.js";

/* ======================================================
   ✅ READ - Get all dresses
   ====================================================== */
export const getDresses = async (req, res) => {
  try {
    const dresses = await DressModel.getAll();
    res.json(dresses);
  } catch (error) {
    console.error("GET DRESSES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch dresses",
    });
  }
};

/* ======================================================
   ✅ CREATE - Add new dress (single or multiple images)
   ====================================================== */
export const createDress = async (req, res) => {
  try {
    await DressModel.create(req.body);
    res.status(201).json({
      message: "Dress created successfully",
    });
  } catch (error) {
    console.error("CREATE DRESS ERROR:", error);
    res.status(500).json({
      message: "Failed to create dress",
    });
  }
};

/* ======================================================
   ✅ UPDATE - Update dress
   Supports:
   - single edit
   - multiple edit
   - append images
   - replace images
   ====================================================== */
export const updateDress = async (req, res) => {
  try {
    await DressModel.update(req.params.id, req.body);
    res.json({
      message: "Dress updated successfully",
    });
  } catch (error) {
    console.error("UPDATE DRESS ERROR:", error);
    res.status(400).json({
      message: error.message || "Failed to update dress",
    });
  }
};

/* ======================================================
   ✅ DELETE - Delete SINGLE image
   ====================================================== */
export const deleteDressImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        message: "image_url is required",
      });
    }

    await DressModel.deleteImage(id, image_url);

    res.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    res.status(400).json({
      message: error.message || "Failed to delete image",
    });
  }
};

/* ======================================================
   ✅ DELETE - Delete dress & ALL images
   ====================================================== */
export const deleteDress = async (req, res) => {
  try {
    await DressModel.delete(req.params.id);
    res.json({
      message: "Dress deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DRESS ERROR:", error);
    res.status(500).json({
      message: "Failed to delete dress",
    });
  }
};
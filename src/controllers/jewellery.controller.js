import { JewelleryModel } from "../models/jewellery.model.js";

/* ======================================================
   ✅ READ - Get all jewellery
   ====================================================== */
export const getJewellery = async (req, res) => {
  try {
    const jewellery = await JewelleryModel.getAll();
    res.json(jewellery);
  } catch (error) {
    console.error("GET JEWELLERY ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch jewellery",
    });
  }
};

/* ======================================================
   ✅ CREATE - Add new jewellery
   Supports:
   - single image
   - multiple images
   ====================================================== */
export const createJewellery = async (req, res) => {
  try {
    await JewelleryModel.create(req.body);
    res.status(201).json({
      message: "Jewellery created successfully",
    });
  } catch (error) {
    console.error("CREATE JEWELLERY ERROR:", error);
    res.status(500).json({
      message: "Failed to create jewellery",
    });
  }
};

/* ======================================================
   ✅ UPDATE - Update jewellery
   Supports:
   - single edit
   - multiple edit
   - append images
   - replace images (if implemented in model)
   ====================================================== */
export const updateJewellery = async (req, res) => {
  try {
    await JewelleryModel.update(req.params.id, req.body);
    res.json({
      message: "Jewellery updated successfully",
    });
  } catch (error) {
    console.error("UPDATE JEWELLERY ERROR:", error);
    res.status(400).json({
      message: error.message || "Failed to update jewellery",
    });
  }
};

/* ======================================================
   ✅ DELETE - Delete SINGLE jewellery image
   ====================================================== */
export const deleteJewelleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        message: "image_url is required",
      });
    }

    await JewelleryModel.deleteImage(id, image_url);

    res.json({
      message: "Jewellery image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JEWELLERY IMAGE ERROR:", error);
    res.status(400).json({
      message: error.message || "Failed to delete jewellery image",
    });
  }
};

/* ======================================================
   ✅ DELETE - Delete jewellery & ALL images
   ====================================================== */
export const deleteJewellery = async (req, res) => {
  try {
    await JewelleryModel.delete(req.params.id);
    res.json({
      message: "Jewellery deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JEWELLERY ERROR:", error);
    res.status(500).json({
      message: "Failed to delete jewellery",
    });
  }
};

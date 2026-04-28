import { db } from "../config/database.js";

export const JewelleryModel = {
  /* ======================================================
     ✅ READ - Get all jewellery with images
     ====================================================== */
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        j.id,
        j.name,
        j.price,
        j.description,
        j.type,
        j.affiliate_link,
        GROUP_CONCAT(ji.image_url) AS images
      FROM jewellery j
      LEFT JOIN jewellery_images ji ON j.id = ji.jewellery_id
      GROUP BY j.id
      ORDER BY j.id DESC
    `);

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      description: row.description,
      type: row.type || "direct",
      affiliate_link: row.affiliate_link || null,
      images: row.images ? row.images.split(",") : [],
    }));
  },

  /* ======================================================
     ✅ CREATE - Add new jewellery
     ❌ DO NOT insert id
     ✅ MySQL AUTO_INCREMENT handles id
     ====================================================== */
  create: async (item) => {
    const {
      name,
      price,
      description,
      images = [],
      type = "direct",
      affiliate_link = null,
    } = item;

    const [result] = await db.query(
      `INSERT INTO jewellery (name, price, description, type, affiliate_link)
       VALUES (?, ?, ?, ?, ?)`,
      [name, price, description, type, affiliate_link]
    );

    const jewelleryId = result.insertId;

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await db.query(
          `INSERT INTO jewellery_images (jewellery_id, image_url)
           VALUES (?, ?)`,
          [jewelleryId, img]
        );
      }
    }
  },

  /* ======================================================
     ✅ UPDATE - Update jewellery
     Supports replaceImages
     ====================================================== */
  update: async (id, item) => {
    const jewelleryId = Number(id);

    const {
      name,
      price,
      description,
      type = "direct",
      affiliate_link = null,
      images = [],
      replaceImages = false,
    } = item;

    const [result] = await db.query(
      `UPDATE jewellery
       SET name = ?, price = ?, description = ?, type = ?, affiliate_link = ?
       WHERE id = ?`,
      [name, price, description, type, affiliate_link, jewelleryId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Jewellery not found");
    }

    if (replaceImages) {
      await db.query(
        `DELETE FROM jewellery_images WHERE jewellery_id = ?`,
        [jewelleryId]
      );
    }

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await db.query(
          `INSERT INTO jewellery_images (jewellery_id, image_url)
           VALUES (?, ?)`,
          [jewelleryId, img]
        );
      }
    }
  },

  /* ======================================================
     ✅ DELETE - Remove single image
     ====================================================== */
  deleteImage: async (jewelleryId, imageUrl) => {
    await db.query(
      `DELETE FROM jewellery_images
       WHERE jewellery_id = ? AND image_url = ?`,
      [Number(jewelleryId), imageUrl]
    );
  },

  /* ======================================================
     ✅ DELETE - Remove jewellery & all images
     ====================================================== */
  delete: async (id) => {
    const jewelleryId = Number(id);

    await db.query(
      `DELETE FROM jewellery_images WHERE jewellery_id = ?`,
      [jewelleryId]
    );

    await db.query(
      `DELETE FROM jewellery WHERE id = ?`,
      [jewelleryId]
    );
  },
};
import { db } from "../config/database.js";

export const DressModel = {
  /* ======================================================
     ✅ READ - Get all dresses with images
     ====================================================== */
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        d.id,
        d.name,
        d.price,
        d.description,
        d.type,
        d.affiliate_link,
        GROUP_CONCAT(di.image_url) AS images
      FROM dresses d
      LEFT JOIN dress_images di ON d.id = di.dress_id
      GROUP BY d.id
      ORDER BY d.id DESC
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
     ✅ CREATE - Add new dress
     ❌ DO NOT insert id
     ✅ MySQL AUTO_INCREMENT handles id
     ====================================================== */
  create: async (dress) => {
    const {
      name,
      price,
      description,
      images = [],
      type = "direct",
      affiliate_link = null,
    } = dress;

    const [result] = await db.query(
      `INSERT INTO dresses (name, price, description, type, affiliate_link)
       VALUES (?, ?, ?, ?, ?)`,
      [name, price, description, type, affiliate_link]
    );

    const dressId = result.insertId;

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await db.query(
          `INSERT INTO dress_images (dress_id, image_url)
           VALUES (?, ?)`,
          [dressId, img]
        );
      }
    }
  },

  /* ======================================================
     ✅ UPDATE - Update dress
     Supports replaceImages
     ====================================================== */
  update: async (id, dress) => {
    const dressId = Number(id);

    const {
      name,
      price,
      description,
      type = "direct",
      affiliate_link = null,
      images = [],
      replaceImages = false,
    } = dress;

    const [result] = await db.query(
      `UPDATE dresses
       SET name = ?, price = ?, description = ?, type = ?, affiliate_link = ?
       WHERE id = ?`,
      [name, price, description, type, affiliate_link, dressId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Dress not found");
    }

    if (replaceImages) {
      await db.query(
        `DELETE FROM dress_images WHERE dress_id = ?`,
        [dressId]
      );
    }

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await db.query(
          `INSERT INTO dress_images (dress_id, image_url)
           VALUES (?, ?)`,
          [dressId, img]
        );
      }
    }
  },

  /* ======================================================
     ✅ DELETE - Remove single image
     ====================================================== */
  deleteImage: async (dressId, imageUrl) => {
    await db.query(
      `DELETE FROM dress_images
       WHERE dress_id = ? AND image_url = ?`,
      [Number(dressId), imageUrl]
    );
  },

  /* ======================================================
     ✅ DELETE - Remove dress & all images
     ====================================================== */
  delete: async (id) => {
    const dressId = Number(id);

    await db.query(
      `DELETE FROM dress_images WHERE dress_id = ?`,
      [dressId]
    );

    await db.query(
      `DELETE FROM dresses WHERE id = ?`,
      [dressId]
    );
  },
};
import { db } from "../config/database.js";

export const BookModel = {
  /* ======================================================
     ✅ READ - Get all books with images
     ====================================================== */
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        b.id,
        b.title,
        b.price,
        b.description,
        b.type,
        b.affiliate_link,
        GROUP_CONCAT(bi.image_url) AS images
      FROM books b
      LEFT JOIN book_images bi ON b.id = bi.book_id
      GROUP BY b.id
      ORDER BY b.id DESC
    `);

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      price: row.price,
      description: row.description,
      type: row.type || "direct",
      affiliate_link: row.affiliate_link || null,
      images: row.images ? row.images.split(",") : [],
    }));
  },

  /* ======================================================
     ✅ CREATE - Add new book
     ❌ DO NOT insert id
     ✅ MySQL AUTO_INCREMENT handles id
     ====================================================== */
  create: async (book) => {
    const {
      title,
      price,
      description,
      images = [],
      type = "direct",
      affiliate_link = null,
    } = book;

    const [result] = await db.query(
      `INSERT INTO books (title, price, description, type, affiliate_link)
       VALUES (?, ?, ?, ?, ?)`,
      [title, price, description, type, affiliate_link]
    );

    const bookId = result.insertId;

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await db.query(
          `INSERT INTO book_images (book_id, image_url)
           VALUES (?, ?)`,
          [bookId, img]
        );
      }
    }
  },

  /* ======================================================
     ✅ UPDATE - Update book
     Supports replaceImages
     ====================================================== */
  update: async (id, book) => {
    const bookId = Number(id);

    const {
      title,
      price,
      description,
      type = "direct",
      affiliate_link = null,
      images = [],
      replaceImages = false,
    } = book;

    const [result] = await db.query(
      `UPDATE books
       SET title = ?, price = ?, description = ?, type = ?, affiliate_link = ?
       WHERE id = ?`,
      [title, price, description, type, affiliate_link, bookId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Book not found");
    }

    if (replaceImages) {
      await db.query(
        `DELETE FROM book_images WHERE book_id = ?`,
        [bookId]
      );
    }

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await db.query(
          `INSERT INTO book_images (book_id, image_url)
           VALUES (?, ?)`,
          [bookId, img]
        );
      }
    }
  },

  /* ======================================================
     ✅ DELETE - Remove single image
     ====================================================== */
  deleteImage: async (bookId, imageUrl) => {
    await db.query(
      `DELETE FROM book_images
       WHERE book_id = ? AND image_url = ?`,
      [Number(bookId), imageUrl]
    );
  },

  /* ======================================================
     ✅ DELETE - Remove book & all images
     ====================================================== */
  delete: async (id) => {
    const bookId = Number(id);

    await db.query(
      `DELETE FROM book_images WHERE book_id = ?`,
      [bookId]
    );

    await db.query(
      `DELETE FROM books WHERE id = ?`,
      [bookId]
    );
  },
};
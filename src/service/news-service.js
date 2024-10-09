import db from "../application/database.js";
import { ResponseError } from "../response/response-error.js";
import "dotenv/config";
import { logger } from "../application/logging.js";

const getNewsCommentsById = async (id) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
          news.id, news.gambar, news.judul, news.subjudul, news.isi, news.created_at, 
          comments.user_id AS user_id, comments.comment, comments.created_at AS comment_created_at
        FROM news 
        LEFT JOIN comments ON news.id = comments.news_id 
        WHERE news.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      throw new ResponseError(404, "News not found");
    }

    const result = {
      id: rows[0].id,
      gambar: rows[0].gambar,
      judul: rows[0].judul,
      subjudul: rows[0].subjudul,
      isi: rows[0].isi,
      created_at: rows[0].created_at,
      comments: [],
    };

    rows.forEach((row) => {
      if (row.comment) {
        result.comments.push({
          user_id: row.user_id,
          comment: row.comment,
          created_at: row.comment_created_at,
        });
      }
    });

    return result;
  } catch (error) {
    logger.error(error);
    throw new ResponseError(500, error.message);
  }
};

export default { getNewsCommentsById };

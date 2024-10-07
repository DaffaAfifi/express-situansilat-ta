import db from "../application/database.js";
import { ResponseError } from "../response/response-error.js";
import "dotenv/config";
import { logger } from "../application/logging.js";
import { createAssistanceToolsValidation } from "../validation/assistance-tools-validation.js";
import { validate } from "../validation/validation.js";

const getAssistanceById = async (id) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
      assistance.id, assistance.nama, assistance.koordinator, assistance.sumber_anggaran, assistance.total_anggaran, assistance.tahun_pemberian, assistance_tools.kuantitas, tools.nama_item, tools.harga, tools.deskripsi
        FROM assistance
        LEFT JOIN assistance_tools ON assistance.id = assistance_tools.assistance_id
        LEFT JOIN tools ON assistance_tools.tools_id = tools.id
        WHERE assistance.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      throw new ResponseError(404, "Assistance not found");
    }

    const result = {
      id: rows[0].id,
      nama: rows[0].nama,
      koordinator: rows[0].koordinator,
      sumber_anggaran: rows[0].sumber_anggaran,
      total_anggaran: rows[0].total_anggaran,
      tahun_pemberian: rows[0].tahun_pemberian,
      tools: rows.map((row) => ({
        nama_item: row.nama_item,
        kuantitas: row.kuantitas,
        harga: row.harga,
        deskripsi: row.deskripsi,
      })),
    };

    return result;
  } catch (error) {
    logger.error(error);
    throw new ResponseError(500, error.message);
  }
};

const createAssistanceTools = async (req, res) => {
  try {
    const data = validate(createAssistanceToolsValidation, req);
    console.log(data);
    const result = await db
      .promise()
      .query("INSERT INTO assistance_tools SET ?", [data]);
    return result;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

export default { getAssistanceById, createAssistanceTools };

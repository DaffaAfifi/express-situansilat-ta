import newsService from "../service/news-service.js";
import { response } from "../response/response.js";
import { logger } from "../application/logging.js";

// Get news comment by id
const getNewsCommentsById = async (req, res, next) => {
  try {
    const result = await newsService.getNewsCommentsById(req.params.id);
    response(200, result, "Get news comment success", res);
  } catch (error) {
    next(error);
  }
};

const test = async (req, res, next) => {
  try {
    res.status(200).json({
      data: "test",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNewsCommentsById,
  test,
};

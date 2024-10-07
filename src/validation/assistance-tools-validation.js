import Joi from "joi";

const createAssistanceToolsValidation = Joi.object({
  assistance_id: Joi.number().integer().required().messages({
    "number.base": "ID asistance harus berupa angka",
    "any.required": "ID asistance harus diisi",
  }),
  tools_id: Joi.number().integer().required().messages({
    "number.base": "ID tools harus berupa angka",
    "any.required": "ID tools harus diisi",
  }),
  kuantitas: Joi.number().integer().required().messages({
    "number.base": "Kuantitas harus berupa angka",
    "any.required": "Kuantitas harus diisi",
  }),
});

export { createAssistanceToolsValidation };

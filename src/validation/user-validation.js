import Joi from "joi";

const registerUserValidation = Joi.object({
  nama: Joi.string().max(100).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
  NIK: Joi.string().length(16).required(),
  alamat: Joi.string().max(100).required(),
  telepon: Joi.string().max(15).required(),
  jenis_kelamin: Joi.string().length(1).required(),
  kepala_keluarga: Joi.integer().length(1).required(),
  tempat_lahir: Joi.string().max(50).required(),
  tanggal_lahir: Joi.date().required(),
  jenis_usaha: Joi.string().max(50).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
});

export { registerUserValidation, loginUserValidation };

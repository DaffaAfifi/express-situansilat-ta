import Joi from "joi";

const registerUserValidation = Joi.object({
  nama: Joi.string().max(100).required().messages({
    "string.base": "Nama harus berupa teks",
    "string.max": "Nama tidak boleh lebih dari 100 karakter",
    "any.required": "Nama harus diisi",
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email harus diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal harus memiliki 6 karakter",
    "any.required": "Password harus diisi",
  }),
  NIK: Joi.string().length(16).regex(/^\d+$/).required().messages({
    "string.length": "NIK harus terdiri dari 16 karakter",
    "string.pattern.base": "NIK hanya boleh terdiri dari angka",
    "any.required": "NIK harus diisi",
  }),
  alamat: Joi.string().max(100).required().messages({
    "string.max": "Alamat tidak boleh lebih dari 100 karakter",
    "any.required": "Alamat harus diisi",
  }),
  telepon: Joi.string().max(15).regex(/^\d+$/).required().messages({
    "string.max": "Nomor telepon tidak boleh lebih dari 15 karakter",
    "string.pattern.base": "Nomor telepon hanya boleh terdiri dari angka",
    "any.required": "Nomor telepon harus diisi",
  }),
  jenis_kelamin: Joi.string().valid("L", "P").required().messages({
    "any.only": "Jenis kelamin harus 'L' (Laki-laki) atau 'P' (Perempuan)",
    "any.required": "Jenis kelamin harus diisi",
  }),
  kepala_keluarga: Joi.number().integer().valid(0, 1).required().messages({
    "any.only": "Kepala keluarga harus bernilai 0 atau 1",
    "number.base": "Kepala keluarga harus berupa angka",
    "any.required": "Field kepala keluarga wajib diisi",
  }),
  tempat_lahir: Joi.string().max(50).required().messages({
    "string.max": "Tempat lahir tidak boleh lebih dari 50 karakter",
    "any.required": "Tempat lahir harus diisi",
  }),
  tanggal_lahir: Joi.date().iso().required().messages({
    "date.format": "Tanggal lahir harus dalam format yang valid (YYYY-MM-DD)",
    "any.required": "Tanggal lahir harus diisi",
  }),
  jenis_usaha: Joi.string().max(50).required().messages({
    "string.max": "Jenis usaha tidak boleh lebih dari 50 karakter",
    "any.required": "Jenis usaha harus diisi",
  }),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email harus diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal harus memiliki 6 karakter",
    "any.required": "Password harus diisi",
  }),
});

const updateUserValidation = Joi.object({
  nama: Joi.string().max(100).messages({
    "string.base": "Nama harus berupa teks",
    "string.max": "Nama tidak boleh lebih dari 100 karakter",
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).messages({
    "string.email": "Email tidak valid",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "Password minimal harus memiliki 6 karakter",
  }),
  NIK: Joi.string().length(16).regex(/^\d+$/).messages({
    "string.length": "NIK harus terdiri dari 16 karakter",
    "string.pattern.base": "NIK hanya boleh terdiri dari angka",
  }),
  alamat: Joi.string().max(100).messages({
    "string.max": "Alamat tidak boleh lebih dari 100 karakter",
  }),
  telepon: Joi.string().max(15).regex(/^\d+$/).messages({
    "string.max": "Nomor telepon tidak boleh lebih dari 15 karakter",
    "string.pattern.base": "Nomor telepon hanya boleh terdiri dari angka",
  }),
  jenis_kelamin: Joi.string().valid("L", "P").messages({
    "any.only": "Jenis kelamin harus 'L' (Laki-laki) atau 'P' (Perempuan)",
  }),
  kepala_keluarga: Joi.number().integer().valid(0, 1).messages({
    "any.only": "Kepala keluarga harus bernilai 0 atau 1",
    "number.base": "Kepala keluarga harus berupa angka",
  }),
  tempat_lahir: Joi.string().max(50).messages({
    "string.max": "Tempat lahir tidak boleh lebih dari 50 karakter",
  }),
  tanggal_lahir: Joi.date().iso().messages({
    "date.format": "Tanggal lahir harus dalam format yang valid (YYYY-MM-DD)",
  }),
  jenis_usaha: Joi.string().max(50).messages({
    "string.max": "Jenis usaha tidak boleh lebih dari 50 karakter",
  }),
});

export { registerUserValidation, loginUserValidation, updateUserValidation };

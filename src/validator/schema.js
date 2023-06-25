const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Nama album tidak boleh kosong',
    'string.base': 'Pengisian nama album tidak benar. Contoh: Album 1',
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Tahun album tidak terisi',
      'number.max': 'Tahun album tidak boleh lebih besar dari tahun saat ini',
      'number.min': 'Tahun album tidak boleh kurang dari 1900',
      'number.integer': 'Pengisian tahun album tidak benar. Contoh: 1999',
      'number.base': 'Pengisian tahun album tidak benar. Contoh: 1999',
    }),
});

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Nama lagu tidak boleh kosong',
    'string.base': 'Pengisian nama lagu tidak benar. Contoh: Lagu 1',
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Tahun lagu tidak terisi',
      'number.max': 'Tahun lagu tidak boleh lebih besar dari tahun saat ini',
      'number.min': 'Tahun lagu tidak boleh kurang dari 1900',
      'number.integer': 'Pengisian tahun lagu tidak benar. Contoh: 1999',
      'number.base': 'Pengisian tahun lagu tidak benar. Contoh: 1999',
    }),
  performer: Joi.string().required().messages({
    'any.required': 'Nama penyanyi tidak boleh kosong',
    'string.base': 'Pengisian nama penyanyi tidak benar. Contoh: Bob',
  }),
  genre: Joi.string().required().messages({
    'any.required': 'Genre tidak boleh kosong',
    'string.base': 'Pengisian genre tidak benar. Contoh: Pop',
  }),
  duration: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'any.required': 'Durasi lagu harus terisi',
      'number.min': 'Durasi lagu tidak boleh kurang dari 0',
      'number.integer': 'Pengisian durasi lagu tidak benar. Contoh: 120',
      'number.base': 'Pengisian durasi lagu tidak benar. Contoh: 120',
    }),
  albumId: Joi.string().messages({
    'string.base': 'Pengisian ID album tidak benar. Contoh: album-wwLDNkNkg545d-sr',
  }),
});

module.exports = { AlbumPayloadSchema, SongPayloadSchema };

const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Nama album tidak boleh kosong',
    'string.base': 'Nama album harus dalam format string',
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Tahun album harus terisi',
      'number.max': 'Tahun album tidak boleh lebih besar dari tahun saat ini',
      'number.min': 'Tahun album tidak boleh kurang dari 1900',
      'number.integer': 'Format tahun album tidak sesuai',
    }),
});

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Nama lagu tidak boleh kosong',
    'string.base': 'Nama lagu harus dalam format string',
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Tahun lagu harus terisi',
      'number.max': 'Tahun lagu tidak boleh lebih besar dari tahun saat ini',
      'number.min': 'Tahun lagu tidak boleh kurang dari 1900',
      'number.integer': 'Format tahun lagu tidak sesuai',
    }),
  performer: Joi.string().required().messages({
    'any.required': 'Nama penyanyi tidak boleh kosong',
    'string.base': 'Nama penyanyi harus dalam format string',
  }),
  genre: Joi.string().required().messages({
    'any.required': 'Genre tidak boleh kosong',
    'string.base': 'Genre harus dalam format string',
  }),
  duration: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'any.required': 'Durasi lagu harus terisi',
      'number.min': 'Durasi lagu tidak boleh kurang dari 0',
      'number.integer': 'Format durasi lagu tidak sesuai',
      'number.base': 'Durasi lagu harus dalam format angka',
    }),
  albumId: Joi.string().messages({
    'string.base': 'ID album harus dalam format string',
  }),
});

module.exports = { AlbumPayloadSchema, SongPayloadSchema };

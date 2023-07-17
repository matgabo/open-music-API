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

module.exports = { AlbumPayloadSchema };

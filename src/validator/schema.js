const Joi = require('joi');
// custom message for missing album name
const errorAlbum = {
  'any.required': 'Album gagal ditambahkan. Periksa kembali nama dah tahun terbit album',
  'string.base': 'Album gagal ditambahkan. Mohon isi nama album dengan benar',
  'number.base': 'Album gagal ditambahkan. Mohon isi tahun terbit album dengan benar',
};

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages(errorAlbum),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages(errorAlbum),
});

module.exports = { AlbumPayloadSchema };

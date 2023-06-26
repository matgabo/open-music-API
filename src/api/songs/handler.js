const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  // post handler
  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;

    const songId = await this.service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  // get handler
  async getSongsHandler(request) {
    const songs = await this.service.getSongs(request);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // get by id handler
  async getSongByIdHandler(request) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  // put handler
  async putSongByIdHandler(request) {
    this.validator.validateSongPayload(request.payload);

    const { id } = request.params;

    await this.service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  // delete handler
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this.service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;

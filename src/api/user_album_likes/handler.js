const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { albumId } = request.params;

    await this._service.verifyUserAlbumLike(credentialId, albumId);
    await this._service.addUserAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan like',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { albumId } = request.params;

    const [likes, cache] = await this._service.getUserAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    if (cache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { albumId } = request.params;

    await this._service.deleteUserAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil membatalkan like',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumLikesHandler;

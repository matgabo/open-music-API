const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this.playlistSongsService = playlistSongsService;
    this.playlistsService = playlistsService;
    this.songsService = songsService;
    this.validator = validator;

    autoBind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this.validator.validatePlaylistSongsPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.songsService.verifySongExistence(songId);
    await this.playlistSongsService.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.playlistSongsService.verifyPlaylistSongExistence(playlistId);

    const playlistDetails = await this.playlistsService.getPlaylistById(playlistId);
    const songs = await this.playlistSongsService.getSongsInPlaylist(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          ...playlistDetails,
          songs,
        },
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongFromPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongsHandler;

const autoBind = require('auto-bind');

class PlaylistSongActivitiesHandler {
  constructor(playlistsService, playlistSongActivitiesService) {
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    autoBind(this);
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistDetails = await this._playlistSongActivitiesService
      .getPlaylistActivities(playlistId);
    const activities = await this._playlistSongActivitiesService
      .getPlaylistSongsActivities(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        ...playlistDetails,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongActivitiesHandler;

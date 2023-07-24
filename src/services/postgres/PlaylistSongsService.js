const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(playlistSongActivitiesService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId, userId, method) {
    const id = `id-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const results = await this._pool.query(query);

    if (!results.rows.length) {
      throw new NotFoundError('Lagu gagal ditambahkan ke playlist');
    }

    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      userId,
      method,
    );

    return results.rows[0].id;
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `
      SELECT 
        songs.id,
        songs.title,
        songs.performer
      FROM
        songs
      LEFT JOIN
        playlist_songs ON songs.id = playlist_songs.song_id
      WHERE
        playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const results = await this._pool.query(query);

    const songs = results.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));

    return songs;
  }

  async deleteSongFromPlaylist(playlistId, songId, userId, method) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const results = await this._pool.query(query);

    if (!results.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }

    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      userId,
      method,
    );
  }

  async verifySongExistence(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;

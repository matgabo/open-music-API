const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const results = await this.pool.query(query);

    if (!results.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

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
      INNER JOIN
        playlist_songs ON songs.id = playlist_songs.song_id
      WHERE
        playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const results = await this.pool.query(query);

    const songs = results.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));

    return songs;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const results = await this.pool.query(query);

    if (!results.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistSongExistence(playlistId) {
    const query = {
      text: 'SELECT song_id FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };

    const results = await this.pool.query(query);

    if (!results.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan pada playlist');
    }
  }
}

module.exports = PlaylistSongsService;

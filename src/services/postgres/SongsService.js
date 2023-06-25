const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToModelSong } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  // add song
  async addSong({
    title,
    year,
    performer,
    genre,
    duration,
    albumId = null,
  }) {
    const songId = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [songId, title, year, performer, genre, duration, albumId],
    };

    const result = await this.pool.query(query);

    // check if song is added
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows.map(mapDBToModelSong)[0].id;
  }

  // get all songs
  async getSongs() {
    const result = await this.pool.query('SELECT id, title, performer FROM songs');
    return result.rows.map(mapDBToModelSong);
  }

  // get song by id
  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this.pool.query(query);

    // check if song is found
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModelSong)[0];
  }

  // edit song by id
  async editSongById(songId, {
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $2, year = $3, performer = $4, genre = $5, duration = $6, album_id = $7 WHERE id = $1 RETURNING id',
      values: [songId, title, year, performer, genre, duration, albumId],
    };

    const result = await this.pool.query(query);

    // check if song is found
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this.pool.query(query);

    // check if song is found
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;

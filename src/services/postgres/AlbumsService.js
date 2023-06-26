const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.pool = new Pool();
  }

  // add album
  async addAlbum({ name, year }) {
    const albumId = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [albumId, name, year],
    };

    const result = await this.pool.query(query);

    // check if album is added
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // get album by id
  async getAlbumById(albumId) {
    // query for album details and associated songs
    const query = {
      text: `
        SELECT 
          album.id AS album_id, album.name AS album_name, album.year AS album_year,
          song.id AS song_id, song.title AS song_title, song.performer AS song_performer
        FROM
          albums AS album
        LEFT JOIN
          songs AS song ON album.id = song.album_id
        WHERE
          album.id = $1
      `,
      values: [albumId],
    };

    const result = await this.pool.query(query);

    // check if album is found
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // album details
    const album = {
      id: result.rows[0].album_id,
      name: result.rows[0].album_name,
      year: result.rows[0].album_year,
      songs: [],
    };

    // songs associated with the album
    const songs = result.rows
      .filter((row) => row.song_id !== null)
      .map((row) => ({
        id: row.song_id,
        title: row.song_title,
        performer: row.song_performer,
      }));

    // add songs to the album only if there are any
    if (songs.length > 0) {
      album.songs = songs;
    }

    return album;
  }

  // edit album by id
  async editAlbumById(albumId, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $2, year = $3 WHERE id = $1 RETURNING id',
      values: [albumId, name, year],
    };

    const result = await this.pool.query(query);

    // check if album is found
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  // delete album by id
  async deleteAlbumById(albumId) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    // check if album is found
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;

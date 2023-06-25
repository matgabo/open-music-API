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
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    // check if album is found
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
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

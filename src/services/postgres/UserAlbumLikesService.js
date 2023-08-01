const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(albumsService) {
    this._pool = new Pool();
    this._albumsService = albumsService;
  }

  async addUserAlbumLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: `
      INSERT INTO user_album_likes (id, user_id, album_id) 
      VALUES ($1, $2, $3)
      RETURNING id`,
      values: [id, userId, albumId],
    };

    await this._albumsService.getAlbumById(albumId);

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menambahkan like. Album tidak ditemukan');
    }
  }

  async getUserAlbumLikes(albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal mendapatkan like. Album tidak ditemukan');
    }

    return result.rowCount;
  }

  async deleteUserAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus like. Album tidak ditemukan');
    }
  }

  async verifyUserAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Gagal menambahkan like. Pengguna hanya bisa menyukai album yang sama sebanyak 1 kali');
    }
  }
}

module.exports = UserAlbumLikesService;

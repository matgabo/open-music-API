const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.albums = [];
  }

  // add album
  addAlbum({ name, year }) {
    const id = nanoid(16);

    const newAlbum = { id, name, year };

    // push newAlbum
    this.albums.push(newAlbum);

    const isSuccess = this.albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new NotFoundError('Album gagal ditambahkan');
    }
    return id;
  }

  // get album by id
  getAlbumById(id) {
    const album = this.albums.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return album;
  }

  // edit album by id
  editAlbumById(id, { name, year }) {
    const index = this.albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    this.albums[index] = {
      ...this.albums[index],
      name,
      year,
    };
  }

  // delete album by id
  deleteAlbumById(id) {
    const index = this.albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    this.albums.splice(index, 1);
  }
}

module.exports = AlbumsService;

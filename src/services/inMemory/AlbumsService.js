const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.albums = [];
  }

  // add album
  addAlbum({ name, year }) {
    const prefixAlbumId = 'album-';
    const id = prefixAlbumId + nanoid(16);
    const albumId = id;

    const newAlbum = { id, name, year };

    // push newAlbum
    this.albums.push(newAlbum);

    const isSuccess = this.albums.filter((album) => album.id === albumId).length > 0;

    if (!isSuccess) {
      throw new NotFoundError('Album gagal ditambahkan');
    }
    return albumId;
  }

  // get album by id
  getAlbumById(albumId) {
    const filteredAlbumId = this.albums.filter((album) => album.id === albumId)[0];
    if (!filteredAlbumId) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return filteredAlbumId;
  }

  // edit album by id
  editAlbumById(albumId, { name, year }) {
    const index = this.albums.findIndex((album) => album.id === albumId);

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
  deleteAlbumById(albumId) {
    const index = this.albums.findIndex((album) => album.id === albumId);

    if (index === -1) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    this.albums.splice(index, 1);
  }
}

module.exports = AlbumsService;

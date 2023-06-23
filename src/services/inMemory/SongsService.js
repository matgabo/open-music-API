const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this.songs = [];
  }

  // add song
  addSong({
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
  }) {
    const prefixSongId = 'song-';
    const id = prefixSongId + nanoid(10);
    const songId = id;

    const newSong = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };

    // push new song to songs
    this.songs.push(newSong);

    const isSuccess = this.songs.filter((song) => song.id === songId).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return songId;
  }

  // get all songs
  getSongs() {
    return this.songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  // get song by id
  getSongById(id) {
    const songId = this.songs.filter((song) => song.id === id)[0];
    if (!songId) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return songId;
  }

  // edit song by id
  editSongById(songId, {
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
  }) {
    const index = this.songs.findIndex((song) => song.id === songId);

    // check if songId is not found
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    // update found song from found index
    this.songs[index] = {
      ...this.songs[index],
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };
  }

  // delete song by id
  deleteSongById(songId) {
    const index = this.songs.findIndex((song) => song.id === songId);

    // check if songId is not found
    if (index === -1) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }

    // delete found song from found index
    this.songs.splice(index, 1);
  }
}

module.exports = SongsService;

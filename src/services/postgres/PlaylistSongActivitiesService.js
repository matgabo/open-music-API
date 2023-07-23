const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelPlaylistActivities } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivities(playlistId, songId, userId, method) {
    const id = `activities-${nanoid(16)}`;
    const action = method === 'post' ? 'add' : 'delete';

    await this._pool.query({
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, NOW())',
      values: [id, playlistId, songId, userId, action],
    });
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: 'SELECT playlist_id FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows.map(mapDBToModelPlaylistActivities)[0];
  }

  async getPlaylistSongsActivities(playlistId) {
    const query = {
      text: `
      SELECT
        users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM
        playlist_song_activities
      LEFT JOIN
        users ON users.id = playlist_song_activities.user_id
      LEFT JOIN
        songs ON songs.id = playlist_song_activities.song_id
      WHERE
        playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const activities = result.rows.map((row) => ({
      username: row.username,
      title: row.title,
      action: row.action,
      time: row.time,
    }));

    return activities;
  }
}

module.exports = PlaylistSongActivitiesService;

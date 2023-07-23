const mapDBToModelSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapDBToModelPlaylistActivities = ({
  id,
  playlist_id,
  song_id,
  user_id,
  action,
  time,
}) => ({
  id,
  playlistId: playlist_id,
  songId: song_id,
  userId: user_id,
  action,
  time,
});

module.exports = { mapDBToModelSong, mapDBToModelPlaylistActivities };

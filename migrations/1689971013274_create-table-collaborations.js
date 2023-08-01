exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', {
    unique: ['playlist_id', 'user_id'],
  });

  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('collaborations', 'fk_collaborations.user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'unique_playlist_id_and_user_id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id');
  pgm.dropTable('collaborations');
};

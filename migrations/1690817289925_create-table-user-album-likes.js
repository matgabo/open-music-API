exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
    },
    album_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'fk_user_id');
  pgm.dropConstraint('user_album_likes', 'fk_album_id');
  pgm.dropTable('user_album_likes');
};

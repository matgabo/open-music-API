exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: 'true',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: 'true',
    },
  });

  pgm.addConstraint('playlists', 'fk_playlists_owner', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists_owner');
  pgm.dropTable('playlists');
};

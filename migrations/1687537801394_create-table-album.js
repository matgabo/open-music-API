// create tables with pgm
exports.up = (pgm) => {
  // create albums table
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
  });

  // create songs table
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
    },
    duration: {
      type: 'INTEGER',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums(id)',
    },
  });
};

// delete tables
exports.down = (pgm) => {
  pgm.dropTable('albums');
  pgm.dropTable('songs');
};

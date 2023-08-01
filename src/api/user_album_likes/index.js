const routes = require('./routes');
const AlbumLikesHandler = require('./handler');

module.exports = {
  name: 'user_album_likes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumLikesHandler = new AlbumLikesHandler(service);
    server.route(routes(albumLikesHandler));
  },
};

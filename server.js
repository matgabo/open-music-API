const Hapi = require('@hapi/hapi');
const albums = require('./src/api/albums');
const songs = require('./src/api/songs');
const AlbumsService = require('./src/services/inMemory/AlbumsService');
const SongsService = require('./src/services/inMemory/SongsService');
const ClientError = require('./src/exceptions/ClientError');
const { AlbumsValidator, SongsValidator } = require('./src/validator');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register with albums and songs plugin
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },

  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    // set error
    if (response instanceof Error) {
      // set ClientError
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // native error from hapi
      if (!response.isServer) {
        return h.continue;
      }

      // server error
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // set success
    return h.continue;
  });

  await server.start();
  console.log(`Server sedang berjalan pada ${server.info.uri}`);
};

init();

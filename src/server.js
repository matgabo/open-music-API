const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/inMemory/AlbumsService');
const ClientError = require('./exceptions/ClientError');
const AlbumsValidator = require('./validator');

const init = async () => {
  const albumsService = new AlbumsService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register with 2 plugins
  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

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

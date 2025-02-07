export default {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/',
        // name of the controller file & the method.
        handler: 'controller.index',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/collections',
        handler: 'shopify.getCollections',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/products/:collectionId',
        handler: 'shopify.getProductsByCollection',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/search-products',
        handler: 'shopify.getProductsBySearch',
        config: {
          policies: [],
        },
      },
    ],
  },
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/',
        // name of the controller file & the method.
        handler: 'controller.index',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/collections',
        handler: 'shopify.getCollections',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/products/:collectionId',
        handler: 'shopify.getProductsByCollection',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/search-products',
        handler: 'shopify.getProductsBySearch',
        config: {
          policies: [],
        },
      },
    ],
  },
};

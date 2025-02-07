import { type Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

const shopify = ({ strapi }: { strapi: Core.Strapi }) => {
  const getCollections = async () => {
    const collections = await strapi.plugin(PLUGIN_ID).service('shopify').getCollections();
    return collections;
  };

  const getProductsByCollection = async (ctx) => {
    ctx.body = await strapi
      .plugin(PLUGIN_ID)
      .service('shopify')
      .getProductsByCollection(ctx.params.collectionId, {
        afterCursor: ctx.request.query.afterCursor,
      });
  };

  const getProductsBySearch = async (ctx) => {
    ctx.body = await strapi
      .plugin(PLUGIN_ID)
      .service('shopify')
      .getProductsBySearch({
        query: ctx.request.query.query,
        first: ctx.request.query.first ? Number(ctx.request.query.first) : undefined,
        last: ctx.request.query.last ? Number(ctx.request.query.last) : undefined,
        startCursor: ctx.request.query.startCursor,
        endCursor: ctx.request.query.endCursor,
      });
  };

  return { getCollections, getProductsByCollection, getProductsBySearch };
};

export default shopify;

import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'shopify-fields-plugin',
    // plugin: PLUGIN_ID,
    type: 'string',
  });

  strapi.customFields.register({
    name: 'shopify-product-field',
    // plugin: PLUGIN_ID,
    type: 'json',
  });
};

export default register;

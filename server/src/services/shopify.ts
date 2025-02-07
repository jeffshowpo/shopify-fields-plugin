import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const shopify = ({ strapi }: { strapi: Core.Strapi }) => {
  const client = createStorefrontApiClient({
    storeDomain: strapi.plugin(PLUGIN_ID).config('shopifyShopUrl'),
    apiVersion: strapi.plugin(PLUGIN_ID).config('shopifyApiVersion'),
    publicAccessToken: strapi.plugin(PLUGIN_ID).config('shopifyStorefrontApiAccessToken'),
  });

  const collectionsQuery = `query {
    collections(first: 10) {
      nodes {
        handle
        id
        title
      }
    }
  }`;

  const getCollections = async () => {
    const data = await client.request(collectionsQuery);

    return {
      collections: data.data.collections.nodes,
    };
  };

  const productsbyCollectionQuery = `query getProductsByCollection($id: ID!, $after: String, $before: String) {
    collection(id: $id) {
      id
      handle
      products(first: 10, after: $after, before: $before) {
        nodes {
          id
          handle
          title
          description
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            id
            altText
            url
            width
            height
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }`;

  const getProductsByCollection = async (
    collectionId: string,
    params?: { afterCursor?: string; beforeCursor?: string }
  ) => {
    const data = await client.request(productsbyCollectionQuery, {
      variables: { id: collectionId, after: params?.afterCursor, before: params?.beforeCursor },
    });

    return {
      products: data.data.collection.products,
    };
  };

  const productSearchQuery = `#graphql
    query searchShopifyProducts($endCursor: String, $first: Int, $last: Int, $query: String!, $startCursor: String) {
      products: search(
        after: $endCursor
        before: $startCursor
        first: $first
        last: $last
        query: $query
        sortKey: RELEVANCE
        types: [PRODUCT]
        unavailableProducts: HIDE
      ) {
        nodes {
          ... on Product {
            id
            title
            handle
            trackingParameters
            featuredImage {
              id
              altText
              url
              width
              height
            }
            priceRange {
              minVariantPrice {
                currencyCode
                amount
              }
              maxVariantPrice {
                currencyCode
                amount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  `;

  const getProductsBySearch = async (params: {
    query: string;
    first?: number;
    last?: number;
    startCursor?: string;
    endCursor?: string;
  }) => {
    const data = await client.request(productSearchQuery, {
      variables: params,
    });

    if (data.errors?.graphQLErrors) {
      if (data.errors.graphQLErrors[0]) {
        return {
          products: null,
          error: data.errors.graphQLErrors[0],
        };
      }
    }

    return {
      products: data.data.products,
    };
  };

  return { getCollections, getProductsByCollection, getProductsBySearch };
};

export default shopify;

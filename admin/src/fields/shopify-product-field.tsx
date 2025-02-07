import * as yup from 'yup';
import { ShopifyCollectionFieldIcon } from '../components/ShopifyCollectionFieldIcon';
import { getTranslation } from '../utils/getTranslation';

export default {
  name: 'shopify-product-field',
  // plugin: PLUGIN_ID,
  type: 'json',
  icon: ShopifyCollectionFieldIcon,
  intlLabel: {
    id: getTranslation('shopify-collection-field.label'),
    defaultMessage: 'Shopify Product',
  },
  intlDescription: {
    id: getTranslation('shopify-collection-field.description'),
    defaultMessage: 'Shopify Product',
  },
  components: {
    Input: async () =>
      import('../components/ShopifyProductField').then((module) => ({
        default: module.ShopifyProductField,
      })),
  },
  options: {
    advanced: [
      {
        sectionTitle: {
          id: 'global.settings',
          defaultMessage: 'Settings',
        },
        items: [
          {
            name: 'required',
            type: 'checkbox',
            intlLabel: {
              id: getTranslation('shopify-collection-field.options.advanced.requiredField.label'),
              defaultMessage: 'Required field',
            },
            description: {
              id: getTranslation(
                'shopify-collection-field.options.advanced.requiredField.description'
              ),
              defaultMessage: "You won't be able to create an entry if this field is empty",
            },
          },
        ],
      },
    ],
    validator: () => ({
      fields: yup
        .array()
        .of(
          yup.object({
            id: yup.string(),
            handle: yup.string(),
            title: yup.string(),
            imageUrl: yup.string(),
          })
        )
        .default([]),
    }),
  },
};

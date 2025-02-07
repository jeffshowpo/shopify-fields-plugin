import { ShopifyCollectionFieldIcon } from 'src/components/ShopifyCollectionFieldIcon';
import { getTranslation } from 'src/utils/getTranslation';

export default {
  name: 'shopify-fields-plugin',
  // plugin: PLUGIN_ID,
  type: 'string',
  icon: ShopifyCollectionFieldIcon,
  intlLabel: {
    id: getTranslation('shopify-collection-field.label'),
    defaultMessage: 'Shopify Collection',
  },
  intlDescription: {
    id: getTranslation('shopify-collection-field.description'),
    defaultMessage: 'Shopify Collection',
  },
  components: {
    Input: async () =>
      import('../components/ShopifyCollectionField').then((module) => ({
        default: module.ShopifyCollectionField,
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
  },
};

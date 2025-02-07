import { Initializer } from './components/Initializer';
import { ShopifyCollectionFieldIcon } from './components/ShopifyCollectionFieldIcon';
import shopifyProductField from './fields/shopify-product-field';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';
export default {
  register(app: any) {
    // app.addMenuLink({
    //   to: `plugins/${PLUGIN_ID}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.plugin.name`,
    //     defaultMessage: PLUGIN_ID,
    //   },
    //   Component: async () => {
    //     const { App } = await import('./pages/App');

    //     return App;
    //   },
    // });
    app.customFields.register([
      {
        name: 'shopify-fields-plugin',
        // plugin: PLUGIN_ID,
        // pluginId: 'shopify-fields-plugin',
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
            import('./components/ShopifyCollectionField').then((module) => ({
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
                    id: getTranslation(
                      'shopify-collection-field.options.advanced.requiredField.label'
                    ),
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
      },
    ]);

    app.customFields.register(shopifyProductField);

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};

import { Combobox, ComboboxOption, Field, Flex, useComposedRefs } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { PLUGIN_ID } from '../pluginId';
import { ShopifyCollection } from './types';

export const ShopifyCollectionField = React.forwardRef<React.ComponentProps<typeof Combobox>, any>(
  (
    { hint, disabled, label, name, required, labelAction, attribute, onChange, ...props },
    forwardedRef
  ) => {
    const { formatMessage } = useIntl();
    const field = useField(name);

    const ref = React.useRef<HTMLButtonElement>(null!);

    const composedRefs = useComposedRefs(forwardedRef, ref);

    const [collections, setCollections] = React.useState<ShopifyCollection[]>([]);

    React.useEffect(() => {
      const abortController = new AbortController();

      fetch(`/api/${PLUGIN_ID}/collections`, { signal: abortController.signal })
        .then((response) => response.json())
        .then((data) => setCollections(data.collections));

      return () => {
        abortController.abort();
      };
    }, []);

    return (
      <Field.Root
        name={name}
        id={name}
        disabled={disabled}
        error={field.error}
        hint={hint}
        required={required}
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>
          <Combobox
            value={field.value}
            onChange={(value: string) =>
              onChange({ target: { name, type: attribute.type, value } })
            }
            disabled={disabled}
            required={required}
            ref={composedRefs}
          >
            {collections.map((collection) => (
              <ComboboxOption key={collection.id} value={collection.id}>
                {collection.title}
              </ComboboxOption>
            ))}
          </Combobox>
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);

ShopifyCollectionField.displayName = 'ShopifyCollectionField';

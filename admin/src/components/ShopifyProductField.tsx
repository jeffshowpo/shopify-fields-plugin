import {
  Box,
  Button,
  Card,
  CardBody,
  CardCheckbox,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  ComboboxOption,
  Field,
  Flex,
  Loader,
  Modal,
  Typography,
} from '@strapi/design-system';

import { ChevronLeft, ChevronRight, Search, Trash } from '@strapi/icons';
import axios from 'axios';
import * as React from 'react';
import { PLUGIN_ID } from '../pluginId';
import { ShopifyCollection, ShopifyProduct, ShopifyProductData } from './types';

import { CardAction, IconButton, TextInput } from '@strapi/design-system';
import { useSpinDelay } from 'spin-delay';

type Product = {
  id: string;
  handle: string;
  imageUrl: string;
  title: string;
};

type PageParams =
  | {
      dir: 'forward';
      first: number;
      endCursor?: string;
    }
  | {
      dir: 'backward';
      last: number;
      startCursor?: string;
    };

export const ShopifyProductField = React.forwardRef<any, any>((props, ref) => {
  const { name, error, hint, label, placeholder, attribute, disabled, required, value, onChange } =
    props;

  const [open, setOpen] = React.useState(false);

  const [selectedProducts, setSelectedProducts] = React.useState<Array<Product>>(value);

  const handleDelete = (productId: string) => {
    const updatedProducts = selectedProducts.filter((p) => p.id !== productId);
    setSelectedProducts(updatedProducts);
    onChange({ target: { name, type: attribute.type, value: updatedProducts } });
  };

  return (
    <Field.Root
      name={name}
      id={name}
      disabled={disabled}
      error={error}
      hint={hint}
      required={required}
    >
      <Field.Label>{label}</Field.Label>
      {value?.length ? (
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {value?.map((product: Product) => (
            <li key={product.id}>
              <Card style={{ display: 'flex', alignItems: 'start', position: 'relative' }}>
                <Box padding={2} width={50} style={{ flexShrink: '0' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    width={50}
                    height={80}
                    style={{ objectFit: 'contain', objectPosition: 'top' }}
                  />
                </Box>
                <CardAction
                  position="end"
                  style={{ position: 'absolute', top: '8px', right: '8px' }}
                >
                  <IconButton
                    withTooltip={false}
                    disabled={disabled}
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash />
                  </IconButton>
                </CardAction>
                <CardBody>
                  <CardContent>
                    <CardTitle>{product.title}</CardTitle>
                  </CardContent>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Trigger>
          <Button size="M" variant="tertiary" disabled={disabled}>
            Select Products
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Select Shopify Products</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProductGrid
              {...props}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary">Cancel</Button>
            </Modal.Close>
            <Button
              onClick={() => {
                onChange({ target: { name, type: attribute.type, value: selectedProducts } });
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </Field.Root>
  );
});

ShopifyProductField.displayName = 'ShopifyProductField';

function CollectionSelect({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
}) {
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
    <Field.Root name="collection" hint="Pick a Shopify collection first" required>
      <Field.Label>Collection</Field.Label>
      <Combobox
        required={true}
        placeholder="Select a collection"
        value={value}
        onChange={onValueChange}
      >
        {collections.map((collection) => (
          <ComboboxOption key={collection.id} value={collection.id}>
            {collection.title}
          </ComboboxOption>
        ))}
      </Combobox>
      <Field.Hint />
    </Field.Root>
  );
}

const DEBOUNCE_PERIOD = 500;

function ProductGrid(props: any) {
  const { selectedProducts, setSelectedProducts } = props;

  const [productsData, setProductsData] = React.useState<ShopifyProductData>();

  const [pageParams, setPageParams] = React.useState<PageParams>({ dir: 'forward', first: 10 });

  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const showLoader = useSpinDelay(isLoading, { delay: 500, minDuration: 200 });

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_PERIOD);
    return () => clearTimeout(timeoutId);
  }, [query]);

  React.useEffect(() => {
    setIsLoading(true);

    const abortController = new AbortController();

    const url = `/api/${PLUGIN_ID}/search-products`;

    axios
      .get(url, {
        params: { query: debouncedQuery, ...pageParams },
        signal: abortController.signal,
      })
      .then((response) => setProductsData(response.data.products))
      .finally(() => setIsLoading(false));

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, pageParams]);

  function handleProductSelect(checked: true | false | 'indeterminate', product: ShopifyProduct) {
    if (checked === true) {
      if (!selectedProducts || !Array.isArray(selectedProducts)) {
        setSelectedProducts([
          {
            id: product.id,
            handle: product.handle,
            title: product.title,
            imageUrl: product.featuredImage.url,
          },
        ]);
        return;
      }

      setSelectedProducts([
        ...selectedProducts,
        {
          id: product.id,
          handle: product.handle,
          title: product.title,
          imageUrl: product.featuredImage.url,
        },
      ]);
    } else {
      setSelectedProducts(selectedProducts.filter((p: any) => p.id !== product.id));
    }
  }

  return (
    <div>
      <Field.Root>
        <Field.Label>Products</Field.Label>
        <Field.Hint />
        <Field.Error />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* <SearchForm>
            <Searchbar
              name="productSearch"
              clearLabel="Clearing the product search"
              placeholder="Search for products"
              onClear={() => setQuery('')}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            >
              Searching for a Shopify product
            </Searchbar>
          </SearchForm> */}
          <TextInput
            placeholder="Search for products"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            startAction={<Search />}
          />
          {debouncedQuery && !productsData?.nodes?.length ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography>No products found for "{debouncedQuery}"</Typography>
            </div>
          ) : null}
          {showLoader ? (
            <Flex height="300px" justifyContent="center" alignItems="center">
              <Loader small>Loading products...</Loader>
            </Flex>
          ) : (
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {productsData?.nodes.map((product) => (
                <li key={product.id}>
                  <Card style={{ display: 'flex', alignItems: 'start' }}>
                    <CardHeader>
                      <CardCheckbox
                        checked={selectedProducts?.some((p: any) => p.id === product.id)}
                        onCheckedChange={(checked: any) => handleProductSelect(checked, product)}
                      />
                    </CardHeader>
                    <Box padding={2} width={50} style={{ flexShrink: '0' }}>
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? ''}
                        width={50}
                        height={80}
                        style={{ objectFit: 'contain', objectPosition: 'top' }}
                      />
                    </Box>
                    <CardBody>
                      <CardContent>
                        <CardTitle>{product.title}</CardTitle>
                      </CardContent>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          )}
          {productsData?.nodes.length ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                gap: '12px',
              }}
            >
              <IconButton
                aria-label="Previous"
                withTooltip={false}
                disabled={!productsData?.pageInfo.hasPreviousPage}
                onClick={() =>
                  setPageParams({
                    dir: 'backward',
                    last: 10,
                    startCursor: productsData.pageInfo.startCursor,
                  })
                }
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                aria-label="Next"
                withTooltip={false}
                disabled={!productsData?.pageInfo.hasNextPage}
                onClick={() =>
                  setPageParams({
                    dir: 'forward',
                    first: 10,
                    endCursor: productsData.pageInfo.endCursor,
                  })
                }
              >
                <ChevronRight />
              </IconButton>
            </div>
          ) : null}
        </div>
      </Field.Root>
    </div>
  );
}

export interface ShopifyCollection {
  handle: string;
  id: string;
  title: string;
}

export interface ShopifyProductData {
  nodes: ShopifyProduct[];
  pageInfo: PageInfo;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  priceRange: PriceRange;
  featuredImage: Image;
}

export interface Image {
  id: string;
  altText: string;
  url: string;
  width: number;
  height: number;
}

export interface PriceRange {
  minVariantPrice: VariantPrice;
  maxVariantPrice: VariantPrice;
}

export interface VariantPrice {
  amount: string;
  currencyCode: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

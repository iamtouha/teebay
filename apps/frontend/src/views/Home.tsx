import { useQuery } from '@apollo/client';
import { Product } from '../utils/types';
import { Stack, Text, Title } from '@mantine/core';
import ProductCard from '../components/ProductCard';
import { LIST_ALL_PRODUCTS } from '../utils/graphql/queries';

export function Home() {
  const { data, error, loading } = useQuery<{ products: Array<Product> }>(LIST_ALL_PRODUCTS);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Stack gap="md" maw={1024} mx={'auto'}>
      <Title style={{ textAlign: 'center' }}>All Products</Title>
      {data?.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {data?.products.length === 0 && <Text style={{ textAlign: 'center' }}>No products found</Text>}
    </Stack>
  );
}

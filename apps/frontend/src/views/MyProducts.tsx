import { useQuery } from '@apollo/client';
import { LIST_MY_PRODUCTS } from '../utils/graphql/queries';
import { Product } from '../utils/types';
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router';

export function MyProducts() {
  const { data, error, loading } = useQuery<{ myProducts: Array<Product> }>(LIST_MY_PRODUCTS);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Stack gap="md" maw={1024} mx={'auto'}>
      <Group justify="space-between">
        <Title size="24px">My Products</Title>
        <Link to="/add-product">
          <Button>+ Add Product</Button>
        </Link>
      </Group>
      {data?.myProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {data?.myProducts.length === 0 && (
        <Box p="lg">
          <Text style={{ textAlign: 'center' }}>No products found</Text>
        </Box>
      )}
    </Stack>
  );
}

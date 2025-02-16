import { gql, useQuery } from '@apollo/client';
import { Product } from '../utils/types';
import { Box, Card, Stack, Text, Title } from '@mantine/core';
import ProductCard from '../components/ProductCard';

const query = gql`
  query {
    products {
      id
      name
      description
      category
      price
      rent
      createdAt
      Owner {
        firstName
        lastName
      }
    }
  }
`;

export function Home() {
  const { data, error, loading } = useQuery<{ products: Array<Product> }>(query);

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
    </Stack>
  );
}

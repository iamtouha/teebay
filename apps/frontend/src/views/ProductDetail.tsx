import { Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router';
import { Product } from '../utils/types';
import { GET_PRODUCT } from '../utils/graphql/queries';
import { useAuthStore } from '../stores/authStore';

export function ProductDetail() {
  let { id } = useParams();
  const userData = useAuthStore((state) => state.user!);
  const { data, loading, error } = useQuery<{ product: Product }>(GET_PRODUCT, { variables: { id } });

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  const product = data?.product;

  if (!product) {
    return <Text>Error: Product not found</Text>;
  }

  return (
    <Box maw={1024} mx="auto">
      <Card key={product.id} withBorder>
        <Stack gap="md">
          <Stack gap="5px">
            <Title size="xl">{product.name}</Title>
            <Text c="gray">
              Price: ${product.price} Rent: ${product.rent}/day
            </Text>
            <Text c="gray">category: {product.categories.join(', ')}</Text>
          </Stack>
          <Text>{product.description}</Text>

          <Group justify="end" gap="sm">
            {userData.id === +product.Owner.id ? (
              <Link to={`/my-products/${product.id}`}>
                <Button size="sm" variant="transparent">
                  Edit Product
                </Button>
              </Link>
            ) : (
              <>
                <Button>Rent</Button>
                <Button>Buy this product</Button>
              </>
            )}
          </Group>
        </Stack>
      </Card>
    </Box>
  );
}

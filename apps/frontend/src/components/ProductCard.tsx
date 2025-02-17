import { Product } from '../utils/types';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card key={product.id} withBorder>
      <Stack gap="md">
        <Title size="md">{product.name}</Title>
        <Text c="gray">
          price: ${product.price} rent: ${product.rent}/day
        </Text>
        <Text c="gray">category: {product.categories.join(', ')}</Text>
        <Text>{product.description}</Text>
        <Group justify="end">
          <Link to={`/products/${product.id}`}>
            <Button size="sm" variant="transparent">
              View details
            </Button>
          </Link>
        </Group>
      </Stack>
    </Card>
  );
}

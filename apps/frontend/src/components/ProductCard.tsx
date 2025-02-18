import { Product } from '../utils/types';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { TrashIcon } from '@radix-ui/react-icons';

export default function ProductCard({
  product,
  showEditBtn,
  showDeleteBtn,
}: {
  product: Product;
  showEditBtn?: boolean;
  showDeleteBtn?: boolean;
}) {
  return (
    <Card key={product.id} withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title size="md">{product.name}</Title>
          {showDeleteBtn ? (
            <Button variant="default" c="red">
              <TrashIcon />
            </Button>
          ) : (
            false
          )}
        </Group>
        <Text c="gray">
          price: ${product.price} rent: ${product.rent}/day
        </Text>
        <Text c="gray">category: {product.categories.join(', ')}</Text>
        <Text lineClamp={2}>{product.description}</Text>
        <Group justify="end" gap="sm">
          {showEditBtn ? (
            <Link to={`/my-products/${product.id}`}>
              <Button size="sm" variant="transparent">
                Edit
              </Button>
            </Link>
          ) : null}
          <Link to={`/products/${product.id}`}>
            <Button size="sm" variant="transparent">
              more details
            </Button>
          </Link>
        </Group>
      </Stack>
    </Card>
  );
}

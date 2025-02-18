import { Product } from '../utils/types';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { TrashIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';

export default function ProductCard({
  product,
  showEditBtn,
  handleDeleteBtnClick,
}: {
  product: Product;
  showEditBtn?: boolean;
  handleDeleteBtnClick?: () => void;
}) {
  return (
    <>
      <Card key={product.id} withBorder>
        <Stack gap="md">
          <Stack gap="0px">
            <Group justify="space-between">
              <Title size="xl">{product.name}</Title>
              {handleDeleteBtnClick ? (
                <Button variant="default" c="red" onClick={handleDeleteBtnClick}>
                  <TrashIcon />
                </Button>
              ) : null}
            </Group>
            <Text c="gray">
              price: ${product.price} rent: ${product.rent}/day
            </Text>
            <Text c="gray">Categories: {product.categories.join(', ')}</Text>
            <Text c="gray">Added at: {dayjs(product.createdAt).format('DD MMM YYYY hh:mm:ss')}</Text>
          </Stack>
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
    </>
  );
}

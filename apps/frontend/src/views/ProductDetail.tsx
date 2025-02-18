import { Box, Button, Card, Group, Modal, Stack, Text, TextInput, Title } from '@mantine/core';
import { useMutation, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router';
import { Product } from '../utils/types';
import { GET_PRODUCT } from '../utils/graphql/queries';
import { useAuthStore } from '../stores/authStore';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { rendProductSchema, RentProductInput } from 'validator';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';
import { BUY_PRODUCT, RENT_PRODUCT } from '../utils/graphql/mutations';

export function ProductDetail() {
  let { id } = useParams();
  const userData = useAuthStore((state) => state.user!);
  const { data, loading, error } = useQuery<{ product: Product }>(GET_PRODUCT, { variables: { id } });
  const [rentProduct] = useMutation(RENT_PRODUCT, {
    refetchQueries: ['ListAllProducts', 'ListMyProducts'],
    onCompleted: () => {
      notifications.show({
        title: 'Product rented',
        message: 'Product rented successfully',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Could not rent product',
        message: error.message,
        color: 'red',
      });
    },
  });
  const [buyProduct] = useMutation(BUY_PRODUCT, {
    refetchQueries: ['ListAllProducts', 'ListMyProducts'],
    onCompleted: () => {
      notifications.show({
        title: 'Product bought',
        message: 'Product bought successfully',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Could not buy product',
        message: error.message,
        color: 'red',
      });
    },
  });
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
                <RentProductModal
                  onRent={(val) => rentProduct({ variables: { input: { ...val, id: +product.id } } })}
                />
                <BuyProductModal onBuy={() => buyProduct({ variables: { id: product.id } })} />
              </>
            )}
          </Group>
        </Stack>
      </Card>
    </Box>
  );
}
function BuyProductModal({ onBuy }: { onBuy: () => void }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open}>Buy this product</Button>
      <Modal opened={opened} onClose={close} title="Buy this product">
        <Text>Are you sure you want to buy this product?</Text>
        <Group align="center" mt="lg" justify="end">
          <Button variant="transparent" onClick={close}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onBuy();
              close();
            }}
          >
            Buy
          </Button>
        </Group>
      </Modal>
    </>
  );
}
function RentProductModal({ onRent }: { onRent: (val: Omit<RentProductInput, 'id'>) => void }) {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<Omit<RentProductInput, 'id'>>({
    initialValues: {
      rentedAt: '',
      rentEnd: '',
    },
    onValuesChange: (values) => console.log(values),
    validate: zodResolver(rendProductSchema.omit({ id: true })),
  });

  return (
    <>
      <Button onClick={open}>Rent</Button>
      <Modal opened={opened} onClose={close} title="Rent this product">
        <form
          onSubmit={form.onSubmit((values) => {
            onRent(values);
            form.reset();
            close();
          })}
        >
          <Text fw="bold">Rental period</Text>
          <Group align="center" justify="space-evenly">
            <TextInput {...form.getInputProps('rentedAt')} type="date" label="From" flex={1} />
            <TextInput {...form.getInputProps('rentEnd')} type="date" label="To" flex={1} />
          </Group>
          <Group align="center" mt="lg" justify="end">
            <Button variant="transparent" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Rent</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

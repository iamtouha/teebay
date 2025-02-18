import { useMutation, useQuery } from '@apollo/client';
import { LIST_MY_PRODUCTS } from '../utils/graphql/queries';
import { Product } from '../utils/types';
import { Box, Button, Group, Modal, Stack, Tabs, Text, Title } from '@mantine/core';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { DELETE_PRODUCT } from '../utils/graphql/mutations';
import { useMemo, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function MyProducts() {
  const { data, error, loading } = useQuery<{ myProducts: Array<Product> }>(LIST_MY_PRODUCTS);
  const [productId, setProductId] = useState<number | null>(null);
  const userId = useAuthStore((state) => state.user?.id);
  const [deleteProduct, deleteProductState] = useMutation(DELETE_PRODUCT, {
    refetchQueries: ['ListAllProducts', 'ListMyProducts'],
    onCompleted: () => {
      closeDeleteModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [deleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const categories = useMemo(() => {
    const owned: Product[] = [];
    const sold: Product[] = [];
    const bought: Product[] = [];
    const borrowed: Product[] = [];
    const lend: Product[] = [];
    const categories = { owned, sold, bought, borrowed, lend };
    if (!data || !userId) return categories;
    data?.myProducts.forEach((product) => {
      if (userId === product.ownerId) {
        if (product.soldToId) sold.push(product);
        else owned.push(product);
      } else if (userId === product.soldToId) {
        bought.push(product);
      } else if (product.Rent?.some((item) => item.userId === userId)) {
        borrowed.push(product);
      } else {
        lend.push(product);
      }
    });
    return categories;
  }, [data, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const fields: Array<{ key: keyof typeof categories; label: string }> = [
    { key: 'owned', label: 'For Sale' },
    { key: 'sold', label: 'Sold' },
    { key: 'bought', label: 'Bought' },
    { key: 'lend', label: 'Lend' },
    { key: 'borrowed', label: 'Borrowed' },
  ];

  return (
    <>
      <Modal opened={deleteModal} onClose={closeDeleteModal} title="Delete this product?">
        <Text>Are you sure you want to delete this product?</Text>
        <Group align="center" mt="lg" justify="end">
          <Button variant="transparent" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteProductState.loading}
            loaderProps={{ variant: 'dots' }}
            onClick={() => {
              if (!productId) return closeDeleteModal();
              deleteProduct({ variables: { id: productId } });
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
      <Box maw={1024} mx={'auto'}>
        <Group justify="space-between">
          <Title size="24px">My Products</Title>
          <Link to="/add-product">
            <Button>+ Product for sale</Button>
          </Link>
        </Group>
        <Tabs defaultValue="owned">
          <Tabs.List>
            {fields.map((field) => (
              <Tabs.Tab key={field.key} value={field.key}>
                {field.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {fields.map((field) => (
            <Tabs.Panel key={field.key} value={field.key} pt="sm">
              <Stack gap="md">
                {categories[field.key].map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showEditBtn={field.key === 'owned'}
                    handleDeleteBtnClick={
                      field.key === 'owned'
                        ? () => {
                            setProductId(product.id);
                            openDeleteModal();
                          }
                        : undefined
                    }
                  />
                ))}
                {categories[field.key].length === 0 && (
                  <Box p="lg">
                    <Text style={{ textAlign: 'center' }}>No products found</Text>
                  </Box>
                )}
              </Stack>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Box>
    </>
  );
}

import { useMutation, useQuery } from '@apollo/client';
import { LIST_MY_PRODUCTS } from '../utils/graphql/queries';
import { Product } from '../utils/types';
import { Box, Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { DELETE_PRODUCT } from '../utils/graphql/mutations';
import { useState } from 'react';

export function MyProducts() {
  const { data, error, loading } = useQuery<{ myProducts: Array<Product> }>(LIST_MY_PRODUCTS);
  const [productId, setProductId] = useState<number | null>(null);
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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
      <Stack gap="md" maw={1024} mx={'auto'}>
        <Group justify="space-between">
          <Title size="24px">My Products</Title>
          <Link to="/add-product">
            <Button>+ Add Product</Button>
          </Link>
        </Group>
        {data?.myProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showEditBtn
            handleDeleteBtnClick={() => {
              setProductId(product.id);
              openDeleteModal();
            }}
          />
        ))}
        {data?.myProducts.length === 0 && (
          <Box p="lg">
            <Text style={{ textAlign: 'center' }}>No products found</Text>
          </Box>
        )}
      </Stack>
    </>
  );
}

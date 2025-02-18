import { Box, Button, Group, MultiSelect, NumberInput, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { createProductSchema, CreateProductInput, Category } from 'validator';
import { useParams } from 'react-router';
import { Product } from '../utils/types';
import { GET_PRODUCT } from '../utils/graphql/queries';
import { UPDATE_PRODUCT } from '../utils/graphql/mutations';

export function UpdateProduct() {
  let { id } = useParams();
  const { data, loading, error, refetch } = useQuery<{ product: Product }>(GET_PRODUCT, { variables: { id } });
  const [update, updateState] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: ['ListAllProducts', 'ListMyProducts'],
    onCompleted: () => {
      refetch();
    },
  });

  const form = useForm<CreateProductInput>({
    initialValues: {
      name: '',
      description: '',
      categories: [],
      price: 0,
      rent: 0,
    },
    validate: zodResolver(createProductSchema),
  });

  useEffect(() => {
    if (!data?.product) return;
    const { name, description, categories, price, rent } = data.product;
    form.setValues({ name, description, categories, price, rent });
  }, [data?.product]);

  const handleSubmit = form.onSubmit((values) => {
    update({ variables: { input: { id, ...values } } });
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Box maw={1024} mx="auto">
      <Title style={{ textAlign: 'center' }} mb="xl">
        Update Product
      </Title>
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <TextInput {...form.getInputProps('name')} label="Product title" required />
          <MultiSelect
            label="Select categories"
            placeholder="Pick value"
            required
            data={Object.values(Category)}
            {...form.getInputProps('categories')}
          />

          <Textarea
            label="Write product description"
            rows={5}
            maxRows={5}
            required
            {...form.getInputProps('description')}
          />
          <NumberInput {...form.getInputProps('price')} label="Price ($)" required />
          <NumberInput {...form.getInputProps('rent')} label="Rent ($ per month)" required />
        </Stack>
        <Group py="sm" justify="center"></Group>
        <Button type="submit" key="submit" loading={updateState.loading} loaderProps={{ type: 'dots' }}>
          Update Product
        </Button>
      </form>
    </Box>
  );
}

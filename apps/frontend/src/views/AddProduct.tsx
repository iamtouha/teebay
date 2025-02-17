import {
  Box,
  Button,
  Card,
  Group,
  MultiSelect,
  NumberInput,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { createProductSchema, CreateProductInput, Category } from 'validator';

export default function AddProduct() {
  const [active, setActive] = useState(0);
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

  const formFieldSteps = [
    {
      title: 'Title',
      description: 'Select a title for your product',
      component: <TextInput {...form.getInputProps('name')} label="Product title" required />,
    },
    {
      title: 'Categories',
      description: 'Select categories',
      component: (
        <MultiSelect
          label="Select categories"
          placeholder="Pick value"
          required
          data={Object.values(Category)}
          {...form.getInputProps('categories')}
        />
      ),
    },
    {
      title: 'Description',
      description: 'Write a description',
      component: (
        <Textarea
          label="Write product description"
          rows={5}
          maxRows={5}
          required
          {...form.getInputProps('description')}
        />
      ),
    },
    {
      title: 'Price',
      description: 'Set price',
      component: (
        <>
          <NumberInput {...form.getInputProps('price')} label="Price" required />
          <NumberInput {...form.getInputProps('rent')} label="Rent" required />
        </>
      ),
    },
  ];
  const nextStep = () => setActive((current) => (current < formFieldSteps.length ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = form.onSubmit(
    (values) => {
      console.log(values);
    },
    (formError) => {
      if ('name' in formError) {
        setActive(0);
      } else if ('categories' in formError) {
        setActive(1);
      } else if ('description' in formError) {
        setActive(2);
      } else if ('price' in formError || 'rent' in formError) {
        setActive(3);
      }
    }
  );

  return (
    <Box maw={1024} mx="auto">
      <Title style={{ textAlign: 'center' }} mb="xl">
        Add Product
      </Title>
      <form onSubmit={handleSubmit}>
        <Stepper active={active} onStepClick={setActive} maw={600} mx="auto">
          {formFieldSteps.map((step) => (
            <Stepper.Step key={step.title}>
              <Card withBorder mih={280}>
                <Title size="20px">{step.title}</Title>
                <Text mb="md">{step.description}</Text>
                <Stack gap={'lg'}>{step.component}</Stack>
              </Card>
            </Stepper.Step>
          ))}
          <Stepper.Completed>
            <Card withBorder mih={280}>
              <Stack gap="sm">
                <Title size="20px">{form.values.name}</Title>
                <Text>Categories: {form.values.categories.join(', ')}</Text>
                <Text>
                  Price: ${form.values.price} or Rent: ${form.values.rent}/day
                </Text>
                <Text>{form.values.description}</Text>
              </Stack>
            </Card>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl" justify="center">
          <Button type="button" variant="default" onClick={prevStep}>
            Back
          </Button>
          {active === 4 ? (
            <Button type="submit" key="submit">
              Add this product
            </Button>
          ) : (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          )}
        </Group>
      </form>
    </Box>
  );
}

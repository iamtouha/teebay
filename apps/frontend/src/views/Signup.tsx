import { Box, Card, TextInput, Title, Stack, Button, Text, Group } from '@mantine/core';
import { registerUserSchema, type RegisterUserInput } from 'validator';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { api } from '../utils/api';
import { Link } from 'react-router';

export function Signup() {
  const form = useForm<RegisterUserInput>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      repeatPassword: '',
    },
    validate: zodResolver(registerUserSchema),
  });

  const handleSubmit = form.onSubmit(async (data) => {
    try {
      await api('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) });
    } catch (error) {
      form.setErrors({ email: 'Cannot create account with this email' });
    }
  });

  return (
    <Box mx="auto" maw={876} mt="xl">
      <Title mb="lg" style={{ fontWeight: 'normal', textAlign: 'center' }}>
        Sign Up on Teebay
      </Title>
      <form onSubmit={handleSubmit}>
        <Card withBorder>
          <Stack>
            <Group justify="stretch">
              <TextInput flex={1} label="First Name" placeholder="First Name" {...form.getInputProps('firstName')} />
              <TextInput flex={1} label="Last Name" placeholder="Last Name" {...form.getInputProps('lastName')} />
            </Group>
            <TextInput label="Email" placeholder="Email" type="email" {...form.getInputProps('email')} />
            <TextInput label="Address" placeholder="Address" {...form.getInputProps('address')} />
            <TextInput label="Phone Number" placeholder="Phone Number" {...form.getInputProps('phone')} />
            <TextInput label="Password" placeholder="Password" type="password" {...form.getInputProps('password')} />
            <TextInput
              label="Repeat Password"
              placeholder="Repeat Password"
              type="password"
              {...form.getInputProps('repeatPassword')}
            />
            <Button type="submit">Submit</Button>
            <Text style={{ textAlign: 'center' }}>
              Already have an account? &nbsp;
              <Link to="/signin">Sign In</Link>
            </Text>
          </Stack>
        </Card>
      </form>
    </Box>
  );
}

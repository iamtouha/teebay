import { Box, Card, TextInput, Title, Stack, Button, Text } from '@mantine/core';
import { LoginUserInput, loginUserSchema } from 'validator';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { api } from '../utils/api';
import { Link } from 'react-router';
import { useAuth } from '../stores/authStore';

export function Signin() {
  const { setToken } = useAuth();
  const form = useForm<LoginUserInput>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginUserSchema),
  });

  const handleSubmit = form.onSubmit(async (data) => {
    try {
      const res = await api<{ token: string }>('/api/auth/signin', { method: 'POST', body: JSON.stringify(data) });
      setToken(res.token);
    } catch (error) {
      form.setErrors({ email: 'Invalid email or password' });
    }
  });

  return (
    <Box mx="auto" maw={876} mt="xl">
      <Title mb="lg" style={{ fontWeight: 'normal', textAlign: 'center' }}>
        Sign in to Teebay
      </Title>
      <form onSubmit={handleSubmit}>
        <Card withBorder>
          <Stack>
            <TextInput label="Email" placeholder="Email" type="email" {...form.getInputProps('email')} />
            <TextInput label="Password" placeholder="Password" type="password" {...form.getInputProps('password')} />
            <Button type="submit">Submit</Button>
            <Text style={{ textAlign: 'center' }}>
              Don&apos;t have an account? &nbsp;
              <Link to="/signup">Sign Up</Link>
            </Text>
          </Stack>
        </Card>
      </form>
    </Box>
  );
}

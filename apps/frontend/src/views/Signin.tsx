import { Box, Card, Title } from '@mantine/core';
import { LoginUserInput, loginUserSchema } from 'validator';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { api } from '../utils/api';

export function Signin() {
  const form = useForm<LoginUserInput>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginUserSchema),
  });

  const handleSubmit = form.onSubmit(async (data) => {
    try {
      await api('/api/auth/signin', { method: 'POST', body: JSON.stringify(data) });
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
        <Card withBorder></Card>
      </form>
    </Box>
  );
}

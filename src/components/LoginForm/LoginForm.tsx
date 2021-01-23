import React from 'react';
import { setToken } from '@/utils/token';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';

// Graphql connection
import gql from 'graphql-tag';
import { useMutation } from 'urql';

// Form
import { useForm } from 'react-hook-form';

// Types
import { Login } from '@/@types/login';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [state, executeMutation] = useMutation(
    isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION,
  );

  const { register, handleSubmit, errors, formState } = useForm<Login>();
  const onSubmit = ({ email, password }: Login) => {
    executeMutation({ email, password }).then(({ data }) => {
      const token = data && data[isLogin ? 'login' : 'signup'].token;
      if (token) {
        setToken(token);
      }
    });
  };

  return (
    <Box maxWidth="2xl">
      <Heading my={6}>{isLogin ? 'Login' : 'Sign Up'}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email" size="lg">
              Email
            </FormLabel>
            <Input
              name="email"
              placeholder="email"
              ref={register({ required: true })}
              size="lg"
              variant="flushed"
              focusBorderColor="teal.500"
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password" size="lg">
              Password
            </FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              ref={register({ required: true })}
              size="lg"
              variant="flushed"
              focusBorderColor="teal.500"
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={formState.isSubmitting}
            disabled={state.fetching}
            type="submit"
          >
            {isLogin ? 'Login' : 'Create account'}
          </Button>
          <Button
            mt={4}
            colorScheme="teal"
            variant="link"
            type="button"
            disabled={state.fetching}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? 'Need to create an account?'
              : 'Already have an account?'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
export default LoginForm;

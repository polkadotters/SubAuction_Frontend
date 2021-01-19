import React from 'react'

import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Box, Heading } from '@chakra-ui/react';

// Graphql connection
import gql from 'graphql-tag';
import { useMutation } from 'urql';

// Form
import { useForm } from "react-hook-form";

// Types
import {Auction} from '@/@types/auction'

// Date manipulation
import moment from 'moment'

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $price: Int!, $endTime: DateTime!) {
    post(title: $title, price: $price, endTime: $endTime) {
      id
      createdAt
      endTime
      title
      price
      postedBy {
        id
        email
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

export const CreateForm: React.FC = () => {
  const [state, executeMutation] = useMutation(POST_MUTATION)

  const { register, handleSubmit, errors, formState } = useForm<Auction>();
  const onSubmit = ({title, startPrice, duration}: Auction) => {    console.log("data", typeof title, typeof parseInt(price));
  const endTime = moment().add(duration, 'hours');
  const price = parseInt(startPrice)
  executeMutation({ title, price, endTime })  };

  return (
    <Box maxWidth='2xl'>
      <Heading as='h1' my={6}>Create auction</Heading>
  <form onSubmit={handleSubmit(onSubmit)}>
    <Stack spacing={6}>
    <FormControl isInvalid={errors.title}>
    <FormLabel htmlFor="title" size="lg">Title</FormLabel>
    <Input
      name="title"
      placeholder="title"
      ref={register({ required: true })}
      size="lg"
      variant="flushed"
      focusBorderColor="teal.500"
    />
    <FormErrorMessage>
      {errors.title && errors.title.message}
    </FormErrorMessage>
  </FormControl>
  <FormControl isInvalid={errors.price}>
    <FormLabel htmlFor="price" size="lg">Price</FormLabel>
    <Input
      name="startPrice"
      type="number"
      placeholder="price"
      ref={register({ required: true })}
      size="lg"
      variant="flushed"
      focusBorderColor="teal.500"
    />
    <FormErrorMessage>
      {errors.price && errors.price.message}
    </FormErrorMessage>
  </FormControl>
  <FormControl isInvalid={errors.duration}>
    <FormLabel htmlFor="duration" size="lg">Duration (in hours)</FormLabel>
    <Input
      name="duration"
      type="number"
      placeholder="duration"
      ref={register({ required: true })}
      size="lg"
      variant="flushed"
      focusBorderColor="teal.500"
    />
    <FormErrorMessage>
      {errors.duration && errors.duration.message}
    </FormErrorMessage>
  </FormControl>
  <Button mt={4} colorScheme="teal" isLoading={formState.isSubmitting} disabled={state.fetching} type="submit">
    Create auction
  </Button>
    </Stack>  
</form>
</Box>
    )};
  export default CreateForm;
import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: NewProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      categories
    }
  }
`;

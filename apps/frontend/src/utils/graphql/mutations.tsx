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
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      description
      price
      rent
      categories
    }
  }
`;
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const RENT_PRODUCT = gql`
  mutation RentProduct($input: RentProductInput!) {
    rentProduct(input: $input) {
      id
    }
  }
`;

export const BUY_PRODUCT = gql`
  mutation BuyProduct($id: ID!) {
    buyProduct(id: $id) {
      id
    }
  }
`;

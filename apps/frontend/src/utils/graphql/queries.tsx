import { gql } from '@apollo/client';

export const LIST_ALL_PRODUCTS = gql`
  query ListAllProducts {
    products {
      id
      name
      description
      categories
      price
      rent
      createdAt
      Owner {
        firstName
        lastName
      }
    }
  }
`;
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      categories
      price
      rent
      createdAt
      Owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export const LIST_MY_PRODUCTS = gql`
  query ListMyProducts {
    myProducts {
      id
      name
      description
      categories
      price
      rent
      createdAt
      ownerId
      soldToId
      Rent {
        id
        userId
      }
    }
  }
`;

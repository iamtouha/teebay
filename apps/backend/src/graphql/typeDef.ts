export const typeDefs = `#graphql
enum Category {
  ELECTRONICS
  FURNITURE
  HOME_APPLIANCES
  SPORTING_GOODS
  OUTDOOR
  TOYS
}

type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  phone: String
  address: String
}

type Product {
  id: ID!
  name: String!
  description: String!
  price: Float!
  rent: Float!
  Owner: User!
  category: Category!
  RentedTo: User
  SoldTo: User
  rentDate: String
  rentEndDate: String
  sellDate: String
  createdAt: String!
  updatedAt: String!
}

type ProductWithOwner {
  id: ID!
  name: String!
  description: String!
  price: Float!
  rent: Float!
  Owner: User!
  category: Category! 
  createdAt: String!
  updatedAt: String!
}

input NewProductInput {
  name: String!
  description: String!
  category: Category!
  price: Float!
  rent: Float!
}

input UpdateProductInput {
  id: ID!
  name: String
  description: String
  category: Category
  price: Float
  rent: Float 
  rentEndDate: String
}

type Mutation {
  createProduct(input: NewProductInput!): Product!
  updateProduct(input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Product!
}

type Query { 
  products: [ProductWithOwner!]!
  myProducts: [Product!]!
  product(id: ID!): Product
}
`;

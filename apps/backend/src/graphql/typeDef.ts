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
  categories: [Category!]!
  SoldTo: User
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
  categories: [Category!]! 
  createdAt: String!
  updatedAt: String!
}

input NewProductInput {
  name: String!
  description: String!
  categories: [Category!]!
  price: Float!
  rent: Float!
}

input UpdateProductInput {
  id: ID!
  name: String
  description: String
  categories: [Category!]
  price: Float
  rent: Float  
}

input RentProductInput {
  id: Int!
  startDate: String!
  endDate: String!
}

type Mutation {
  createProduct(input: NewProductInput!): Product!
  updateProduct(input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Product!
  rentProduct(input: RentProductInput!): Product!
  buyProduct(id: ID!): Product!
}

type Query { 
  products: [ProductWithOwner!]!
  myProducts: [Product!]!
  product(id: ID!): Product
}
`;

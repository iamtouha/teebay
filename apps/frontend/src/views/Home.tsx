import { gql } from '@apollo/client';

const query = gql`
  query {
    products {
      id
      name
    }
  }
`;

export function Home() {
  return <div>Home</div>;
}

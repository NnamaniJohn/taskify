import { gql, GraphQLClient } from 'graphql-request';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { gqlHost } = useRuntimeConfig(event)
  const graphQLClient = new GraphQLClient(gqlHost);

  const mutation = gql`
      mutation($email: String!, $password: String!) {
          login(loginUserInput:{
              email: $email,
              password: $password,
          }){
              accessToken
          }
      }
  `;

  interface Data {
    login: { accessToken: string }
  }

  const data = await graphQLClient.request<Data>(mutation, {
    email: body.email,
    password: body.password,
  });

  return {
    token: { accessToken: data.login.accessToken },
  }
})
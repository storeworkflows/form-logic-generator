export default function graphqlRequest({ operationName, query, variables, params }: {
    operationName?: string;
    query?: {};
    variables?: {};
    params?: {};
}): Promise<Response>;

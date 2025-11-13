class GraphDBClient {
  // Static constants
  static readonly TIMEOUT                     = 300000; // 300 seconds
  static readonly DEFAULT_ENDPOINT            = 'http://localhost:7200/repositories/';
  static readonly DEFAULT_REPOSITORY          = 'PolitiRDF';
  static readonly CONTENT_TYPE_SPARQL_QUERY   = 'application/sparql-query';

  // Static configuration
  private static endpoint:    string = GraphDBClient.DEFAULT_ENDPOINT;
  private static repository:  string = GraphDBClient.DEFAULT_REPOSITORY;

  /**
   * Configure the GraphDB endpoint and repository
   */
  static configure(endpoint: string, repository: string): void {
    GraphDBClient.endpoint = endpoint.endsWith('/') 
      ? endpoint 
      : `${endpoint}/`;
    GraphDBClient.repository = repository;
  }

  /**
   * Get the full query URL
   */
  private static getQueryUrl(): string {
    return `${GraphDBClient.endpoint}${GraphDBClient.repository}`;
  }

  /**
   * Execute a SPARQL SELECT or ASK query
   */
  static async query<T = any>(sparqlQuery: string): Promise<T> {
    const url = `${GraphDBClient.getQueryUrl()}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': GraphDBClient.CONTENT_TYPE_SPARQL_QUERY,
        'Access-Control-Allow-Origin': '*',
      },
      body: sparqlQuery,
      signal: AbortSignal.timeout(GraphDBClient.TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GraphDB query failed: ${response.status} - ${errorText}`
      );
    }
    
    return await response.text() as T;
  }
}

export { GraphDBClient };

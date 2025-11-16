class GraphDBClient {
  // Static constants
  static readonly TIMEOUT                     = 300000; // 300 seconds
  static readonly DEFAULT_ENDPOINT            = 'http://localhost:5000/proxy/repositories/';
  static readonly DEFAULT_REPOSITORY          = 'PolitiRDF';
  static readonly CONTENT_TYPE_SPARQL_QUERY   = 'application/sparql-query';

  private static DEFAULT_PREFIXES: string = `
PREFIX politi: <http://politiRDF.com/>

PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
PREFIX bd: <http://www.bigdata.com/rdf#>
`;

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
      body: `${GraphDBClient.DEFAULT_PREFIXES}\n${sparqlQuery}`,
      signal: AbortSignal.timeout(GraphDBClient.TIMEOUT),
      headers: { 'Content-Type': GraphDBClient.CONTENT_TYPE_SPARQL_QUERY, },
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

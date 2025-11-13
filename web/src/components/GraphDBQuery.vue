<template>
  <div class="graphdbform">
    <textarea v-model="query" placeholder="Enter your SPARQL query here"></textarea>
    <button @click="runQuery">Run Query</button>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      Error: {{ error }}
    </div>

    <div v-if="result" class="success">
      <h3>Query Results:</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<style scoped>
.graphdbform {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

.loading {
  font-weight: bold;
  margin-top: 1rem;
}

.success {
  color: green;
  margin-top: 1rem;
}

textarea {
  width: 75%;
  height: 700px;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 1.2rem;
  background-color: #2e2e2e;
  color: #ffffff;
  border: 1px solid #444;
  padding: 0.5rem;
  border-radius: 5px;
}

textarea::placeholder {
  color: #aaaaaa;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #444;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #555;
}
</style>

<script lang="ts">
import { GraphDBClient } from '@/plugins/GraphDBClient';

export default {
  name: 'GraphDBQuery',

  data() {
    return {
      query: '',
      result: null as any,
      error: null as string | null,
      loading: false,
    };
  },

  methods: {
    setupDB() {
      GraphDBClient.configure(
        'http://localhost:7200/repositories',
        'PolitiRDF'
      );
    },

    async runQuery() {
      try {
        this.loading = true;
        this.error = null;
        this.result = null;

        if (!this.query.trim()) {
          this.error = 'Please enter a SPARQL query.';
          return;
        }

        const res = await GraphDBClient.query(this.query);
        this.result = GraphDBClient.extractBindings(res);
      } catch (err: any) {
        this.error = err.message || 'An error occurred while executing the query.';
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    this.setupDB();
  },
};
</script>

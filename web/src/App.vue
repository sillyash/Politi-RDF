<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <AppHeader />

  <main>
    <h1 class="title">Politi-RDF</h1>
    <p class="subtitle">
      Récupérez des statistiques sur nos députés en un clin d'œil grâce à Politi-RDF,
      votre source fiable pour des données parlementaires accessibles et compréhensibles.
    </p>
  </main>

  <AppFooter />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.title {
  text-align: center;
  width: 100%;
  font-weight: bold;
  font-size: 2.5rem;
}

.subtitle {
  text-align: center;
  width: 100%;
  font-size: 1.25rem;
  margin-top: 0.5rem;
  color: var(--color-text-secondary);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

<template>
  <footer class="app-footer">
    <p>Politi-RDF</p>
    <p>&copy; {{ new Date().getFullYear() }}</p>
    <p>
      <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
        MIT License
      </a>
    </p>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.app-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  text-align: center;

  color: white;
  background-color: #405840;

  padding: 1rem;
  text-align: center;
}

.app-footer a {
  color: #bcc755;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>

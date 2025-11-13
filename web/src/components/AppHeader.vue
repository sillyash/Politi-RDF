<template>
  <header class="app-header">
    <div class="logo">
      <img src="/favicon.png" alt="App Logo" />
      <span class="app-name">Politi-RDF</span>
    </div>
    <nav class="nav-links">
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.app-header {
  display: flex;

  background-color: white;
  color: black;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  align-items: center;
  padding: 10px 20px;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nav-links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-links a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>

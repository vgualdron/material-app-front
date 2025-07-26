<template>
  <div class="container">
    <div class="image-wrapper">
      <img src="~/assets/logo-rectangle.png" alt="Imagen 1" class="centered-image" />
      <img src="~/assets/control.png" alt="Imagen 2" class="centered-image" />
    </div>
    <p class="centered-text">Presiona <span class="shortcut">Control + Shift + R</span>.</p>
    <q-btn
      class="centered-button"
      color="white"
      text-color="blue"
      unelevated
      to="/home"
      label="Ir a inicio"
      no-caps
    />
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #01355f; /* Fondo azul */
}

.image-wrapper {
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: 20px auto;
}

.centered-image {
  max-width: 100%;
}

.centered-text {
  font-size: 24px; /* Letras más grandes */
  text-align: center;
  opacity: 0.7;
  font-weight: bold; /* Letras más gruesas */
  color: white; /* Color blanco */
}

.shortcut {
  font-family: monospace; /* Estilo de fuente monoespaciada para el atajo de teclado */
}
</style>

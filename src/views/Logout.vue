<template>
  <h1>logout to continue</h1>
  <form id="logout" method="post" action="https://openly-api.meower.org/logout">
    <button type="submit" value="Logout">
      Logout
    </button>
  </form>
</template>
<script lang="ts">
  export default {
    name: "Logout",
  };
</script>
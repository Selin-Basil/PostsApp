<template>
  <header>
    <div class="top-bar">
      <button class="mobile-menu-btn" @click="$emit('toggleSidebar')">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <h4>My Application</h4>
      <div class="header-items">
        <div>Register</div>
        <div>Profile</div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  padding: 0 1rem;
  background-color: #428bca;
  color: white;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 1001;
}
.header-items {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: end;
}
/* 1. Hide on Desktop */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
}

.hamburger-line {
  width: 30px;
  height: 3px;
  background-color: #ffffff;
  border-radius: 5px;
}

/* 2. Show ONLY on Mobile */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex; /* This makes it visible */
  }
}
</style>

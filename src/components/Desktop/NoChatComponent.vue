<script setup></script>

<template>
  <div class="empty-state">
    <span class="badge">Workspace</span>
    <h2>Select a session</h2>
    <p>Choose a conversation from the session bar to begin the exchange.</p>
    <div class="rule"></div>
  </div>
</template>

<style scoped>
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.badge {
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.7rem;
  color: var(--accent-strong);
  border: 1px solid var(--accent-soft);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.empty-state p {
  max-width: 320px;
  color: var(--ink-500);
}

.rule {
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  margin-top: 0.5rem;
}
</style>

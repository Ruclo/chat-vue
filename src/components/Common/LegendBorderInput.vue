<script setup>
const props = defineProps({
  legend: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    default: 'text'
  },

  onSubmit: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="input-container">
    <fieldset>
      <legend>
        <!--Password-->
        {{ props.legend }}
      </legend>

      <input
        @keydown.enter="onSubmit"
        @input="updateValue($event.target.value)"
        :type="props.inputType"
        class="auth-input"
        required
      />
    </fieldset>
  </div>
</template>

<style scoped>
.input-container {
  position: relative;
  margin-bottom: 20px;
}

.input-container fieldset {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem 0.6rem;
  background: var(--surface-muted);
  margin: 0;
}

.auth-input {
  border: none;
  width: 100%;
  background: transparent;
  color: var(--ink-900);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.auth-input:focus {
  outline: none;
}

.input-container legend {
  color: var(--accent-strong);
  text-align: left;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0 0.4rem;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--ink-900);
  transition: background-color 5000s ease-in-out 0s;
}
</style>

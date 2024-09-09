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
.auth-input {
  border: none;
  width: 100%;
}
.input-container {
  position: relative;
  margin-bottom: 20px;
}

.auth-input {
  width: 100%;
  padding: 5px;
  background: none;
  color: white;
  font-size: 2em;
}

.auth-input:focus {
  outline: none;
  border-color: aquamarine;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

.input-container legend {
  color: aquamarine;
  text-align: left;
  font-size: 14px;
}
</style>

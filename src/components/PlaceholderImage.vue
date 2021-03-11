<template>
  <v-img
    :aspect-ratio="aspectRatio"
    :height="height"
    :weight="weight"
    :src="srcWrapper"
    @error="onError"
    style="cover"
  >
    <slot></slot>
  </v-img>
</template>

<script>
export default {
  name: 'PlaceholderImage',
  props: ['height', 'aspectRatio', 'src', 'weight', 'errorSrc'],
  data: () => ({
    isError: false
  }),
  watch: {
    src() {
      this.clear()
    }
  },
  computed: {
    srcWrapper() {
      if (!this.src || this.isError) {
        return this.errorSrc || ''
      }
      return this.src
    }
  },
  methods: {
    onError() {
      this.isError = true
      this.$emit('error')
    },
    clear() {
      this.isError = false
    }
  }
}
</script>

// See more:
// https://aaron-bird.github.io/2019/03/20/储存keep-alive内组件的滚动位置/

export default {
  mounted() {
    const page = this.$el
    page.addEventListener('scroll', () => {
      this.scrollTop = page.scrollTop
    })
  },
  activated() {
    if (this.scrollTop) {
      const page = this.$el
      page.scrollTop = this.scrollTop
    }
  },
  deactivated() {}
}

<template>
  <v-container class="panel search" style="padding-bottom: 64px;">
    <v-layout wrap>
      <v-flex xs12 pb-3>
        <v-layout wrap>
          <v-flex xs12 mb-3>
            <v-text-field
              ref="searchSearch"
              v-model="keyword"
              placeholder="搜尋"
              solo
              clearable
              hide-details
              prepend-icon="mdi-arrow-left"
              append-icon="mdi-magnify"
              @click:prepend="close"
              @keyup.enter="searchText(keyword)"
              @click:append="searchText(keyword)"
              @click:clear="close"
              autocomplete="off"
              rounded
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-layout>
              <v-flex xs4 pr-1>
                <v-select
                  v-model="filterRating"
                  :items="ratingItems"
                  dense
                  outlined
                  hide-details
                  @change="search()"
                ></v-select>
              </v-flex>
              <v-flex xs4 pl-1 pr-1>
                <v-select
                  v-model="filterPriceLevel"
                  :items="priceLevelItems"
                  dense
                  outlined
                  hide-details
                  @change="search()"
                ></v-select>
              </v-flex>
              <v-flex xs4 pl-1>
                <v-select
                  v-model="filterSortBy"
                  :items="sortByList"
                  dense
                  outlined
                  hide-details
                  @change="search()"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-layout wrap>
          <template v-if="SearchEngine.resultList.length === 0">
            <v-flex xs12 style="text-align: center;" pt-5>
              沒有符合的項目
            </v-flex>
          </template>

          <template v-for="(item, index) in SearchEngine.resultList">
            <v-flex
              xs12
              :key="index"
              @click="$router.push(`/detail/${item.cid}`)"
              style="cursor: pointer;"
            >
              <v-layout>
                <v-flex xs4 mr-3 class="search-item-img">
                  <placeholder-image
                    weight="100%"
                    height="100%"
                    :src="`${APIBASE}/img/place_header/${item.cid}.jpg`"
                    :error-src="
                      'https://post.healthline.com/wp-content/uploads/2020/09/healthy-eating-ingredients-1200x628-facebook-1200x628.jpg'
                    "
                    style="background-size: cover;"
                  ></placeholder-image>
                </v-flex>

                <v-flex xs12 pt-3 class="search-item-content">
                  <h3
                    style="
                      height: 28px;
                      overflow: hidden;
                      text-overflow: ellipse;
                      text-wrap: no-wrap;
                    "
                  >
                    {{ item.name }}
                  </h3>
                  <div style="height: 24px; overflow: hidden;">
                    <span class="yellow--text text--darken-4">
                      {{ item.rating }}
                    </span>

                    <v-rating
                      v-if="item.rating"
                      style="display: inline; position: relative; top: -2px;"
                      dense
                      empty-icon="mdi-star-outline"
                      full-icon="mdi-star"
                      half-icon="mdi-star-half-full"
                      hover
                      length="5"
                      :value="item.rating"
                      readonly
                      size="18"
                      background-color="yellow darken-4"
                      color="yellow darken-4"
                      half-increments
                    ></v-rating>
                    <span
                      class="grey--text text--darken-1"
                      v-if="item.user_ratings_total"
                    >
                      ({{ item.user_ratings_total }})
                    </span>

                    <span
                      v-if="item.price_level"
                      class="grey--text text--darken-1"
                    >
                      ·
                      {{ '$'.repeat(item.price_level) }}
                    </span>

                    <span
                      v-if="!item.user_ratings_total"
                      class="grey--text text--darken-1"
                    >
                      評論不足
                    </span>
                  </div>
                  <div
                    style="height: 24px; overflow: hidden;"
                    class="grey--text text--darken-1"
                  >
                    {{ item.formatted_address }}
                  </div>
                  <div
                    style="height: 24px; overflow: hidden;"
                    v-html="aspectRatingDescription(item, true, filterSortBy)"
                  ></div>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
            </v-flex>
          </template>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import bus from '../lib/bus'
import SearchEngine from '../lib/search'
import {
  aspectRatingsList,
  aspectRatingsDict,
  aspectRatingDescription
} from '../lib/utils'
import PlaceholderImage from '../components/PlaceholderImage.vue'

// 定义mixin, 用于记录scroll位置
const keepScrollTop = {
  mounted() {
    // 获取组件根元素Dom
    const page = this.$el
    // 绑定事件,滚动时,储存位置到this.scrollTop
    page.addEventListener('scroll', () => {
      this.scrollTop = page.scrollTop
    })
  },
  // activated生命钩子在keep-alive被激活时调用
  activated() {
    // 如果曾滚动过,则还原位置
    if (this.scrollTop) {
      const page = this.$el
      page.scrollTop = this.scrollTop
    }
  },
  // deactivated生命钩子在keep-alive被停用时调用
  // 如果onScroll绑定在window之类的元素上,记得用removeEventListener删除事件
  deactivated() {}
}

export default {
  name: 'Search',
  mixins: [keepScrollTop],
  components: { PlaceholderImage },
  data: () => ({
    text: '',
    keyword: '',
    ratingItems: [
      { text: '評價', value: 0 },
      { text: '1⭐+', value: 1 },
      { text: '2⭐+', value: 2 },
      { text: '3⭐+', value: 3 },
      { text: '4⭐+', value: 4 },
      { text: '4.5⭐+', value: 4.5 }
    ],
    filterRating: 0,
    priceLevelItems: [
      { text: '價格', value: 0 },
      { text: '$+', value: 1 },
      { text: '$$+', value: 2 },
      { text: '$$$+', value: 3 },
      { text: '$$$$+', value: 4 }
    ],
    filterPriceLevel: 0,
    filterSortBy: 'distance',
    sortByList: [
      { text: '距離排序', value: 'distance' },
      { text: '評價排序', value: 'rating' },
      { text: '食物評價排序', value: 'food_rating' },
      { text: '服務評價排序', value: 'service_rating' },
      { text: '氣氛評價排序', value: 'atmosphere_rating' },
      { text: '清潔評價排序', value: 'cleanliness_rating' },
      { text: '價值評價排序', value: 'value_rating' }
    ]
  }),
  computed: {
    APIBASE: () => window.APIBASE,
    SearchEngine: () => SearchEngine,
    aspectRatingsDict: () => aspectRatingsDict,
    aspectRatingsList: () => aspectRatingsList,
    aspectRatingDescription: () => aspectRatingDescription
  },
  methods: {
    blur() {
      this.$refs.searchSearch.blur()
    },
    close(redicrect = true) {
      this.keyword = ''
      this.filterRating = 0
      this.filterPriceLevel = 0
      this.filterSortBy = 'distance'
      bus.$emit('search-clear')
      this.blur()
      if (redicrect) {
        this.$router.push('/')
      }
      this.SearchEngine.clear()
      blur()
    },
    search(text) {
      if (!text) {
        text = this.keyword
      }
      this.keyword = text
      this.blur()
      this.SearchEngine.clear()
      console.log('perform searching.', text)
      if (text === '附近的餐廳') {
        this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
      } else if (text === '我附近的餐廳') {
        this.searchNearbyGPS()
      } else if (text === '氣氛好的餐廳') {
        this.filterSortBy = 'atmosphere_rating'
        this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
      } else if (text === '食物好的餐廳') {
        this.filterSortBy = 'food_rating'
        this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
      } else {
        this.SearchEngine.search({
          keyword: text,
          rating: this.filterRating,
          price_level: this.filterPriceLevel,
          sort_by: this.filterSortBy
        })
      }
    },
    searchNearbyGPS() {
      console.log('gps')
      navigator.geolocation.getCurrentPosition(
        (res) => {
          console.log(res)
          let lat = res.coords.latitude + 0
          let lng = res.coords.longitude - 0.008755
          this.searchNearby(lat, lng)
        },
        (err) => {
          console.error(err)
          alert('請開啟您的定位功能！')
        }
      )
    },
    searchNearby(lat = '', lng = '', text = '') {
      let args = {
        keyword: text,
        lng: lng,
        lat: lat,
        rating: this.filterRating,
        price_level: this.filterPriceLevel,
        sort_by: this.filterSortBy
      }
      console.log(args)
      this.SearchEngine.searchNearby(args)
    },
    searchText() {
      console.log('searchText', this.keyword)
      this.$router.push(`/search/${this.keyword}`)
    }
  },
  mounted() {
    this.keyword = this.$route.params.query
    this.search(this.keyword)
    console.log('mounted')
    bus.$on('search-clear', () => {
      this.keyword = ''
    })
  },
  created() {
    this.keyword = this.$route.params.query
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(vm.keyword, to.params.query)
      if (vm.keyword === to.params.query) {
        return
      }
      console.log('beforeRouteEnter!')
      vm.keyword = to.params.query
      vm.search(to.params.query)
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate!', to.params.query)
    this.search(to.params.query)
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave!')
    if (to.name === 'Home') {
      this.close(false)
    }
    next()
  }
}
</script>

<style scoped>
.search {
  width: 100%;
  height: 100%;
}

.search-item-img {
  height: 120px;
}
.search-item-content {
  height: 120px;
}
</style>

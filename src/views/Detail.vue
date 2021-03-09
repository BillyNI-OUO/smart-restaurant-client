<template>
  <v-layout wrap class="panel detail" style="padding-bottom: 64px;">
    <v-flex xs12 pb-3>
      <v-layout wrap>
        <v-flex
          xs12
          class="detail-cover"
          style="
            background-image: url(https://lh5.googleusercontent.com/p/AF1QipNQdMzkcM-kCtxRQ8897hVVqQFWSPQIKf8CpqiB=w408-h306-k-no);
          "
        >
          <v-container>
            <v-btn
              depressed
              @click="$router.back()"
              style="background-color: #ffffffdd;"
            >
              <v-icon>mdi-arrow-left</v-icon>
              返回上一頁
            </v-btn>
            <v-btn
              depressed
              @click="close"
              style="background-color: #ffffffdd; float: right;"
            >
              <v-icon>mdi-close</v-icon>
              關閉
            </v-btn>
          </v-container>
        </v-flex>
        <v-flex xs12 v-if="placeInfo">
          <v-container>
            <h2>{{ placeInfo.name }}</h2>
            <p>
              <span>
                <span class="yellow--text text--darken-4">
                  {{ placeInfo.rating }}
                </span>
                <v-rating
                  style="display: inline; position: relative; top: -2px;"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  length="5"
                  :value="placeInfo.rating"
                  readonly
                  size="18"
                  background-color="yellow darken-4"
                  color="yellow darken-4"
                  half-increments
                  v-if="placeInfo.rating"
                ></v-rating>
                <span
                  class="grey--text text--darken-1"
                  v-if="placeInfo.user_ratings_total"
                >
                  ({{ placeInfo.user_ratings_total }}則評論)
                </span>
                <span
                  v-if="placeInfo.price_level"
                  class="grey--text text--darken-1"
                >
                  ·
                  {{ '$'.repeat(placeInfo.price_level) }}
                </span>

                <span
                  v-if="!placeInfo.user_ratings_total"
                  class="grey--text text--darken-1"
                >
                  評論不足
                </span>
              </span>
              <br />
              <span v-html="aspectRatingDescription(placeInfo, true)"> </span>
            </p>
          </v-container>

          <v-list>
            <v-divider></v-divider>

            <v-list-item
              :href="
                `https://www.google.com.tw/maps/search/${
                  placeInfo.name
                } ${placeInfo.formatted_address || ''}`
              "
              target="_blank"
            >
              <v-list-item-icon>
                <v-icon color="primary">mdi-map</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> 在 Google Map 中開啟 </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item v-if="placeInfo.formatted_address">
              <v-list-item-icon>
                <v-icon color="primary">mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ placeInfo.formatted_address }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider v-if="placeInfo.formatted_address"></v-divider>

            <!--
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  提出修改建議
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            -->
          </v-list>

          <v-container v-if="hasAnyAspectRatings">
            <h3 class="mt-3 mb-2">評論摘要</h3>

            <v-layout wrap>
              <v-flex
                v-for="item in aspectRatingsList.filter(
                  (item) => placeInfo[`${item.key}_rating`]
                )"
                :key="item.key"
                style="text-align: center; user-select: none; cursor: pointer;"
                @click="
                  reviewsAspect = item.key
                  loadReviews()
                "
                v-ripple
              >
                <div style="font-size: 15px;">
                  {{ item.text }}
                </div>
                <div
                  style="font-size: 24px; line-height: 30px;"
                  class="yellow--text text--darken-4"
                >
                  {{ placeInfo[`${item.key}_rating`].toFixed(1) }}
                </div>
                <!--
                <v-rating
                  style="position: relative; top: -7px; height: 14px;"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  length="5"
                  :value="placeInfo[`${item.key}_rating`]"
                  readonly
                  size="14"
                  background-color="yellow darken-4"
                  color="yellow darken-4"
                  half-increments
                ></v-rating>
                -->
                <div class="grey--text" style="font-size: 14px;">
                  ({{ placeInfo[`${item.key}_count`] }})
                </div>
              </v-flex>
            </v-layout>
          </v-container>

          <v-divider v-if="hasAnyAspectRatings"></v-divider>

          <v-container v-if="hasAnyAspectRatings">
            <v-layout v-if="rated === RATED_STATE.NOT_RATED">
              <v-flex style="padding-top: 3px; font-size: 14px;">
                您覺得這些資訊準確嗎？
              </v-flex>
              <v-flex style="width: 175px; text-align: right;">
                <v-btn text @click="feedback(0)" small class="mr-3">
                  不準確
                </v-btn>
                <v-btn outlined @click="feedback(1)" small>
                  準確
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout v-if="rated === RATED_STATE.DETAIL" wrap>
              <v-flex xs12 style="padding-top: 3px; font-size: 14px;">
                請問您覺得是哪個指標不準確呢？
              </v-flex>
              <v-flex xs12 style="" class="mt-2" v-if="hasAnyAspectRatings">
                <template
                  v-for="item in aspectRatingsList.filter(
                    (item) => placeInfo[`${item.key}_rating`]
                  )"
                >
                  <v-layout :key="item.key" class="pt-2">
                    <v-flex style="text-align: left; margin-top: 3px;">
                      <span class="pr-1">
                        {{ item.text }}
                      </span>
                      <span
                        class="grey--text text--darken-1"
                        style="display: inline; position: relative; top: -1px; font-size: 14px;"
                      >
                        原分數
                      </span>
                      <span class="yellow--text text--darken-4">
                        {{ placeInfo[`${item.key}_rating`].toFixed(1) }}
                      </span>
                      <v-icon
                        color="grey--text text--darken-"
                        style="display: inline; position: relative; top: -2px;"
                      >
                        mdi-arrow-right
                      </v-icon>
                      <span
                        class="grey--text text--darken-1"
                        style="display: inline; position: relative; top: -1px; font-size: 14px;"
                      >
                        新分數
                      </span>
                      <span class="yellow--text text--darken-4">
                        {{ feedbackDetail[`${item.key}_rating`].toFixed(1) }}
                      </span>
                    </v-flex>
                    <v-flex style="text-align: right; margin-top: 3px;">
                      <v-rating
                        style="display: inline; position: relative; top: -2px;"
                        dense
                        empty-icon="mdi-star-outline"
                        full-icon="mdi-star"
                        half-icon="mdi-star-half-full"
                        hover
                        length="5"
                        v-model="feedbackDetail[`${item.key}_rating`]"
                        size="24"
                        background-color="yellow darken-4"
                        color="yellow darken-4"
                        half-increments
                        v-if="placeInfo[`${item.key}_rating`]"
                      >
                      </v-rating>
                    </v-flex>
                  </v-layout>
                </template>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  class="mt-4"
                  label="其他想法或建議"
                  outlined
                  rows="2"
                  v-model="feedbackDetail.memo"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 style="text-align: right;">
                <v-btn text @click="rated = RATED_STATE.RATED" class="mr-3">
                  取消
                </v-btn>
                <v-btn text @click="sendFeedbackDetail()" outlined>
                  送出
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout v-if="rated === RATED_STATE.RATED">
              <div style="margin: 0 auto; text-align: center">
                <img
                  style="width: 150px"
                  src="https://chojugiga.com/c/choju54_0031/choju54_0031.png"
                />
                <p>謝謝你</p>
              </div>
            </v-layout>
          </v-container>

          <v-divider v-if="hasAnyAspectRatings"></v-divider>

          <v-container>
            <h3 class="mt-5 mb-2">評論</h3>

            <v-layout>
              <v-flex mr-3>
                <v-select
                  v-model="reviewsAspect"
                  :items="reviewsAspectList"
                  dense
                  outlined
                  hide-details
                  @change="loadReviews()"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  v-model="reviewsSortBy"
                  :items="reviewsSortByList"
                  dense
                  outlined
                  hide-details
                  @change="loadReviews()"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>

          <template v-for="item in reviews">
            <v-container :key="item.id">
              <v-layout>
                <v-flex class="pr-3" style="padding-top: 2px;">
                  <v-avatar
                    :color="item.rating > 3 ? 'green' : 'red'"
                    size="42"
                  >
                    <v-icon dark v-if="item.rating > 3"> mdi-thumb-up </v-icon>
                    <v-icon dark v-else> mdi-thumb-down </v-icon>
                  </v-avatar>
                </v-flex>
                <v-flex xs12>
                  <span
                    class="grey--text text--darken-1"
                    style="font-size: 16px;"
                  >
                    {{ item.author_name }}
                  </span>
                  <br />

                  <span class="yellow--text text--darken-4">
                    {{ item.rating }}
                  </span>
                  <v-rating
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
                  <span class="grey--text"> · {{ toDate(item.time) }} </span>
                </v-flex>
              </v-layout>

              <p
                class="pt-3 pb-0 mb-0"
                v-html="item.text.replace(/\n/g, '<br>')"
              ></p>
            </v-container>
            <v-divider :key="item.id + '-divider'"></v-divider>
          </template>

          <template v-if="reviews.length === 0">
            <p style="text-align: center;" class="mt-3">沒有評論</p>
          </template>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import bus from '../lib/bus'
import SearchEngine from '../lib/search'
import {
  aspectRatingsList,
  aspectRatingsDict,
  aspectRatingDescription
} from '../lib/utils'
import axios from 'axios'
import Vue from 'vue'

const feedbackDetailDefault = {
  food_rating: null,
  service_rating: null,
  atmosphere_rating: null,
  cleanliness_rating: null,
  value_rating: null,
  memo: ''
}

const RATED_STATE = {
  NOT_RATED: 0,
  DETAIL: 1,
  RATED: 2
}

export default {
  name: 'Detail',
  data: () => ({
    cid: '',
    placeInfo: {},
    reviews: [],

    rated: RATED_STATE.NOT_RATED,
    feedbackRating: 1,
    feedbackDetail: Object.assign({}, feedbackDetailDefault),

    reviewsAspect: 'all',
    reviewsAspectList: [
      { text: '全部', value: 'all' },
      { text: '食物', value: 'food' },
      { text: '服務', value: 'service' },
      { text: '氣氛', value: 'atmosphere' },
      { text: '清潔', value: 'cleanliness' },
      { text: '價值', value: 'value' }
    ],
    reviewsSortBy: 'importance',
    reviewsSortByList: [
      { text: '重要性', value: 'importance' },
      { text: '時間', value: 'time' },
      { text: '評價（高至低）', value: 'rating_desc' },
      { text: '評價（低至高）', value: 'rating_asc' }
    ]
  }),
  computed: {
    SearchEngine: () => SearchEngine,
    aspectRatingsDict: () => aspectRatingsDict,
    aspectRatingsList: () => aspectRatingsList,
    aspectRatingDescription: () => aspectRatingDescription,
    hasAnyAspectRatings() {
      for (let { key } of this.aspectRatingsList) {
        if (this.placeInfo[key + '_count'] > 0) {
          return true
        }
      }
      return false
    },
    RATED_STATE: () => RATED_STATE
  },
  methods: {
    toDate(time) {
      let d = new Date(time)
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
    },
    load(cid) {
      axios.get(`${window.APIBASE}/detail/${cid}`).then((res) => {
        let data = res.data
        if (data.error) {
          console.error(data)
          return
        }
        this.rated = RATED_STATE.NOT_RATED
        this.reviewsAspect = 'all'
        this.reviewsSortBy = 'importance'
        Vue.set(this, 'placeInfo', data)

        this.loadReviews()
      })
    },
    loadReviews() {
      Vue.set(this, 'reviews', [])
      let url = `${window.APIBASE}/reviews/${this.cid}?aspect=${this.reviewsAspect}&sort_by=${this.reviewsSortBy}`
      axios.get(url).then((res) => {
        let data = res.data
        if (data.error) {
          console.error(data)
          return
        }
        Vue.set(this, 'reviews', data.data)
      })
    },
    close() {
      bus.$emit('search-clear')
      this.SearchEngine.clear()
      this.rated = RATED_STATE.NOT_RATED
      this.reviewsAspect = 'all'
      this.reviewsSortBy = 'importance'
      Vue.set(this, 'reviews', [])
      this.$router.push('/')
    },
    feedback(rating) {
      if (!this.cid) {
        return
      }
      axios
        .get(`${window.APIBASE}/feedback/place/${this.cid}/${rating}`)
        .then((res) => {
          let data = res.data
          if (data.error) {
            console.error(data)
            return
          }
          this.rated = rating === 1 ? RATED_STATE.RATED : RATED_STATE.DETAIL
          this.feedbackRating = rating

          if (this.hasAnyAspectRatings) {
            Vue.set(
              this,
              'feedbackDetail',
              Object.assign({}, feedbackDetailDefault)
            )
            for (let { key } of this.aspectRatingsList) {
              this.feedbackDetail[`${key}_rating`] = this.placeInfo[
                `${key}_rating`
              ]
            }
          }
        })
    },
    sendFeedbackDetail() {
      if (!this.cid) {
        return
      }
      this.rated = RATED_STATE.RATED
      axios
        .post(
          `${window.APIBASE}/feedback/detail/${this.cid}`,
          this.feedbackDetail
        )
        .then((res) => {
          let data = res.data
          if (data.error) {
            console.error(data)
            return
          }
        })
    }
  },
  mounted() {
    // this.cid = this.$route.params.cid
    // this.load(this.cid)
  },
  created() {
    this.cid = this.$route.params.cid
    this.load(this.cid)
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.cid === to.params.cid) {
        return
      }
      vm.cid = to.params.cid
      vm.load(to.params.cid)
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate!', to.params.cid)
    this.cid = to.params.cid
    this.load(to.params.cid)
    next()
  }
}
</script>

<style scoped>
.detail-cover {
  height: 200px;
  background-size: cover;
}
</style>

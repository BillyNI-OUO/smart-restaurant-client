<template>
  <v-layout wrap class="panel detail overflow-y-auto overflow-x-hidden">
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
              style="background-color: #ffffffdd"
            >
              <v-icon>mdi-arrow-left</v-icon>
              返回上一頁
            </v-btn>
            <v-btn
              depressed
              @click="close"
              style="background-color: #ffffffdd; float: right"
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
                  style="display: inline; position: relative; top: -2px"
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
                  {{ "$".repeat(placeInfo.price_level) }}
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
              :href="`https://www.google.com.tw/maps/search/${placeInfo.name} ${
                placeInfo.formatted_address || ''
              }`"
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
                <v-list-item-title> 提出修改建議 </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            -->
          </v-list>

          <v-container>
            <h3 class="mt-3 mb-2">
              評論摘要
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  v-model="sort_method"
                  :items="sortbyList"
                  item-value="key"
                  label="評論排序"
                  @change="loadReviews(this.cur_aspect)"
                ></v-select>
              </v-col>
            </h3>
            <v-btn text block @click="loadReviews('all')">ALL</v-btn>
            <v-layout wrap>
              <v-flex
                v-for="item in aspectRatingsList.filter(
                  (item) => placeInfo[`${item.key}_rating`]
                )"
                :key="item.key"
                style="text-align: center; user-select: none"
              >
                <v-btn
                  block
                  x-small
                  fab
                  tile
                  text
                  @click="loadReviews(`is_${item.key}`)"
                >
                  <v-flex style="font-size: 15px">
                    {{ item.text }}
                  </v-flex>
                </v-btn>
                <v-flex
                  style="font-size: 24px; line-height: 30px"
                  class="yellow--text text--darken-4"
                >
                  {{ placeInfo[`${item.key}_rating`].toFixed(1) }}
                </v-flex>
                <!--
                <v-rating
                  style="position: relative; top: -7px; height: 14px"
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
                <v-flex class="grey--text" style="font-size: 14px">
                  ({{ placeInfo[`${item.key}_count`] }})
                </v-flex>
              </v-flex>
            </v-layout>
            <!--
            <p>
              <template v-for="item in aspectRatingsList">
                <div
                  :key="item.key"
                  class="mb-2"
                  v-if="placeInfo[`${item.key}_rating`]"
                >
                  {{ item.text }}
                  {{ placeInfo[`${item.key}_rating`].toFixed(1) }}
                  <v-rating
                    style="display: inline; position: relative; top: -2px"
                    dense
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                    half-icon="mdi-star-half-full"
                    hover
                    length="5"
                    :value="placeInfo[`${item.key}_rating`]"
                    readonly
                    size="18"
                    background-color="yellow darken-4"
                    color="yellow darken-4"

                    half-increments
                  ></v-rating>
                  ({{ placeInfo[`${item.key}_count`] }})
                </div>
              </template>
            </p>
            -->
          </v-container>
          <!-- old reviews
          <v-list>
            <v-divider></v-divider>
            <v-list-item three-line v-for="index in 10" :key="index">
              <v-list-item-content>
                <v-rating
                  v-if="rating[0]"
                  style="position: relative; top: -7px; height: 14px"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  length="5"
                  :value="rating[index]"
                  readonly
                  size="14"
                  background-color="yellow darken-4"
                  color="yellow darken-4"
                  half-increments
                ></v-rating>
                <v-list-item-title v-if="reviews[0]">
                  {{ reviews[index] }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
          -->
          <!-- test -->
          <div v-if="rating[0]">
            <v-row dense>
              <v-col cols="12" v-for="id in 10" :key="id">
                <v-card>
                  <v-card-title class="headline">
                    {{ author[id] }}

                    <v-rating
                      style="position: relative; top: -7px; height: 14px"
                      dense
                      empty-icon="mdi-star-outline"
                      full-icon="mdi-star"
                      half-icon="mdi-star-half-full"
                      hover
                      length="5"
                      :value="rating[id]"
                      readonly
                      size="14"
                      background-color="yellow darken-4"
                      color="yellow darken-4"
                      half-increments
                    ></v-rating>
                  </v-card-title>
                  <v-card-subtitle>
                    {{ reviews[id] }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <!--<p>{{ placeInfo }}</p>-->

          <v-container mb-3 v-if="hasAnyAspectRatings">
            <v-card>
              <v-card-title>
                您覺得這些資訊有用嗎？
              </v-card-title>

              <v-card-actions v-if="!rated">
                <v-spacer></v-spacer>
                <v-btn text @click="feedback(0)">
                  <v-icon class="mr-1">mdi-emoticon-sad-outline</v-icon>沒有用
                </v-btn>
                <v-btn outlined @click="feedback(1)">
                  <v-icon class="mr-1">mdi-emoticon-happy-outline</v-icon>有幫助
                </v-btn>
              </v-card-actions>

              <v-card-actions v-else>
                <div style="margin: 0 auto; text-align: center">
                  <img
                    v-if="feedbackRating === 1"
                    style="width: 200px"
                    src="https://chojugiga.com/c/choju54_0031/choju54_0031.png"
                  />
                  <img
                    v-else
                    style="width: 200px"
                    src="https://chojugiga.com/c/choju51_0035/choju51_0035.png"
                  />
                  <p>謝謝你</p>
                </div>
              </v-card-actions>
            </v-card>
          </v-container>

          <v-divider v-if="hasAnyAspectRatings"></v-divider>

          <v-container>
            <h3 class="mt-5 mb-2">評論</h3>

          <v-container style="display: none">
            <h3 class="mt-3 mb-2">評論</h3>
          </v-container>

          <template v-for="item in reviews">
            <v-container :key="item.id">
              <v-layout>
                <v-flex class="pr-3" style="padding-top: 2px;">
                  <v-avatar
                    :color="item.rating > 3 ? 'green' : 'red'"
                    size="42"
                  >
                    <v-icon dark v-if="item.rating > 3">
                      mdi-thumb-up
                    </v-icon>
                    <v-icon dark v-else>
                      mdi-thumb-down
                    </v-icon>
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
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import bus from "../lib/bus";
import SearchEngine from "../lib/search";
import {
  aspectRatingsList,
  aspectRatingsDict,
  aspectRatingDescription,
} from "../lib/utils";
import axios from "axios";
import Vue from "vue";

export default {
  name: "Detail",
  data: () => ({
    cid: "",
    placeInfo: {},
    rated: false,
    feedbackRating: 1,
    cur_aspect: "all",
    reviews: {},
    rating: {},
    author: {},
    sortbyList: [
      { text: "全部", key: 0 },
      { text: "近期評論", key: 1 },
      { text: "好評", key: 2 },
      { text: "負評", key: 3 },
      { text: "關鍵評論", key: 4 },
    ],
    sort_method: 0,
  }),
  computed: {
    SearchEngine() {
      return SearchEngine;
    },
    aspectRatingsDict() {
      return aspectRatingsDict;
    },
    aspectRatingsList() {
      return aspectRatingsList;
    },
    aspectRatingDescription() {
      return aspectRatingDescription;
    },
  },
  methods: {
    toDate(time) {
      let d = new Date(time);
      return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    },
    load(cid) {
      axios.get(`${window.APIBASE}/detail/${cid}`).then((res) => {
        let data = res.data;
        if (data.error) {
          console.error(data);
          return;
        }
        this.rated = false;
        Vue.set(this, "placeInfo", data);
        this.loadReviews(this.cur_aspect);
      });
    },
    loadReviews(cur_aspect) {
      axios
        .get(
          `${window.APIBASE}/detail/${this.cid}/reviews?cur_aspect=${cur_aspect}&sort_by=${this.sort_method}`
        )
        .then((res) => {
          let data = res.data;
          if (data.error) {
            console.error(data);
            return;
          }
          Vue.set(this, "reviews", data.text);
          Vue.set(this, "rating", data.rating);
          Vue.set(this, "author", data.author);
        });
      this.cur_aspect = cur_aspect;
    },
    close() {
      bus.$emit("search-clear");
      this.SearchEngine.clear();
      this.rated = false;
      this.reviews = {};
      this.author = {};
      this.rating = {};
      this.$router.push("/").catch(() => {});
    },
    feedback(rating) {
      if (!this.cid) {
        return;
      }
      axios
        .get(`${window.APIBASE}/feedback/place/${this.cid}/${rating}`)
        .then((res) => {
          let data = res.data;
          if (data.error) {
            console.error(data);
            return;
          }
          this.rated = true;
          this.feedbackRating = rating;
        });
    },
  },
  mounted() {
    // this.cid = this.$route.params.cid
    // this.load(this.cid)
  },
  created() {
    this.cid = this.$route.params.cid;
    this.load(this.cid);
    this.cur_aspect = "all";
    this.sort_method = 0;
    //this.loadReviews(this.cur_aspect);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.cid === to.params.cid) {
        return;
      }
      vm.cid = to.params.cid;
      vm.load(to.params.cid);
      //vm.loadReviews(to.params.cur_aspect);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log("beforeRouteUpdate!", to.params.cid);
    this.cid = to.params.cid;
    this.load(to.params.cid);
    //this.loadReviews(to.params.cur_aspect);
    next();
  },
};
</script>

<style scoped>
.detail-cover {
  height: 200px;
  background-size: cover;
}
</style>

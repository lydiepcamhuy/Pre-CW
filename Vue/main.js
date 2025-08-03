Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img :src="image" :alt="product">
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>
        <p>Shipping: {{ shipping }}</p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <p v-if="onSale">On Sale!</p>
        <a :href="link" target="_blank">More Products like this</a>

        <div v-for="(variant, index) in variants"
             :key="variant.id"
             class="color-box"
             :style="{ backgroundColor: variant.color }"
             @mouseover="updateProduct(index)">
        </div>

        <button @click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }">
          Add to Cart
        </button>

        <button @click="removeFromCart">Remove from cart</button>

        <product-tabs :reviews="reviews"></product-tabs>
      </div>
    </div>
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      description: 'A pair of warm fuzzy socks.',
      selectedVariant: 0,
      onSale: true,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      variants: [
        { id: 2234, color: "green", image: './assets/vmSocks-green.png', quantity: 10 },
        { id: 2235, color: "blue", image: './assets/vmSocks-blue.png', quantity: 0 }
      ],
      reviews: [],
      link: 'https://www.vuemastery.com'
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].id)
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].image
    },
    inStock() {
      return this.variants[this.selectedVariant].quantity > 0
    },
    shipping() {
      return this.premium ? "Free" : "$2.99"
    }
  }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option disabled value="">Select Rating</option>
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
      <label>Yes <input type="radio" value="Yes" v-model="recommend" /></label>
      <label>No <input type="radio" value="No" v-model="recommend" /></label>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: '',
      review: '',
      rating: null,
      recommend: '',
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        this.$emit('review-submitted', productReview)
        this.name = ''
        this.review = ''
        this.rating = null
        this.recommend = ''
      } else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("Review required.")
        if (!this.rating) this.errors.push("Rating required.")
        if (!this.recommend) this.errors.push("Recommendation required.")
      }
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
      <span class="tab"
            :class="{ activeTab: selectedTab === 'Reviews' }"
            @click="selectedTab = 'Reviews'">Reviews</span>
      <span class="tab"
            :class="{ activeTab: selectedTab === 'Make a Review' }"
            @click="selectedTab = 'Make a Review'">Make a Review</span>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="review in reviews">
            <p>{{ review.name }} gave this {{ review.rating }} stars</p>
            <p>"{{ review.review }}"</p>
            <p>Recommended: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>

      <product-review v-show="selectedTab === 'Make a Review'"
                      @review-submitted="addReview"></product-review>
    </div>
  `,
  data() {
    return {
      selectedTab: 'Reviews'
    }
  },
  methods: {
    addReview(review) {
      this.reviews.push(review)
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      const index = this.cart.indexOf(id)
      if (index !== -1) {
        this.cart.splice(index, 1)
      }
    }
  }
})

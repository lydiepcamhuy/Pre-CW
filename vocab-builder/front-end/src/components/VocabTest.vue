<template>
    <div>
      <h2>Score: {{ score }} out of {{ this.words.length }}</h2>
  
      <form action="#" @submit.prevent="onSubmit">
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i class="germany flag"></i> German
          </div>
          <input type="text" readonly :disabled="testOver" :value="currWord.german"/>
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i class="united kingdom flag"></i> English
          </div>
          <input type="text" placeholder="Enter word..." v-model="english" :disabled="testOver" autocomplete="off" />
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">
    <i class="spain flag"></i> Spanish
  </div>
  <input type="text" placeholder="Enter word..." v-model="spanish" :disabled="testOver" autocomplete="off"/>
</div>
        <button class="positive ui button" :disabled="testOver">Submit</button>
      </form>
  
      <p :class="['results', resultClass]">
        <span v-html="result"></span>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'vocab-test',
    props: {
      words: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        randWords: [...this.words.sort(() => 0.5 - Math.random())],
        incorrectGuesses: [],
        result: '',
        resultClass: '',
        english: '',
        spanish: '',
        score: 0,
        testOver: false
      };
    },
    computed: {
      currWord: function() {
        return this.randWords.length ? this.randWords[0] : '';
      }
    },
    methods: {
  onSubmit() {
    console.log("SUBMIT TEST");

    const curr = this.currWord;
    if (!curr || !curr.english || !curr.spanish) {
      console.error('currWord thiếu dữ liệu:', curr);
      return;
    }

    const correctEnglish = this.english.trim().toLowerCase() === curr.english.trim().toLowerCase();
    const correctSpanish = this.spanish.trim().toLowerCase() === curr.spanish.trim().toLowerCase();

    if (correctEnglish && correctSpanish) {
      this.flash('Correct!', 'success', { timeout: 1000 });
      this.score += 1;
    } else {
      this.flash('Wrong!', 'error', { timeout: 1000 });

      const incorrect = [];
      if (!correctEnglish) incorrect.push(`${curr.german} (English)`);
      if (!correctSpanish) incorrect.push(`${curr.german} (Spanish)`);
      this.incorrectGuesses.push(...incorrect);
    }

    this.english = '';
    this.spanish = '';
    this.randWords.shift();

    if (this.randWords.length === 0) {
      this.testOver = true;
      this.displayResults();
    }
  },

  displayResults() {
    if (this.incorrectGuesses.length === 0) {
      this.result = 'You got everything correct. Well done!';
      this.resultClass = 'success';
    } else {
      const incorrect = this.incorrectGuesses.join(', ');
      this.result = `<strong>You got the following words wrong:</strong> ${incorrect}`;
      this.resultClass = 'error';
    }
  }
}
     }
  </script>
  
  <style scoped>
  .results {
    margin: 25px auto;
    padding: 15px;
    border-radius: 5px;
  }
  
  .error {
    border: 1px solid #ebccd1;
    color: #a94442;
    background-color: #f2dede;
  }
  
  .success {
    border: 1px solid #d6e9c6;
    color: #3c763d;
    background-color: #dff0d8;
  }
  </style>
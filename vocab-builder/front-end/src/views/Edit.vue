<template>
  <div>
    <h1>Edit Word</h1>
    <word-form @createOrUpdate="createOrUpdate" :word=this.word></word-form>
  </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';

export default {
  name: 'edit',
  components: {
    'word-form': WordForm
  },
  data: function() {
    return {
      word: {}
    };
  },
  async mounted() {
    this.word = await api.getWord(this.$route.params.id);
  },
  methods: {
  createOrUpdate: async function(word) {
    await api.updateWord(word);
    this.flash('Word updated successfully!', 'success');
    this.$router.push(`/words/${word._id}`);
  }
}   
};
</script>

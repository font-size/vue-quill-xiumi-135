<template>
  <div>
    <quillEditor v-model="msg" class="my-editor"/>
  </div>
</template>

<script>
import quillEditor from './components/quill';
export default {
  name: 'quill-xiumi-135',
  components: {quillEditor},
  data() {
    return {
      msg: '111'
    }
  },
  methods:{
  }
}
</script>
<style>
/* .my-editor,.my-text {
  width: 50%;
  display: inline-block;
}
.my-text {
  vertical-align: top;
} */
</style>

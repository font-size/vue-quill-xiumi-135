<template>
  <div>
    <quillEditor v-model="msg"/>
  </div>
</template>

<script>
import quillEditor from './components/quill';
export default {
  name: 'quill-xiumi-135',
  components: {
    quillEditor
  },
  data() {
    return {
      msg: ''
    }
  },
  methods:{
  }
}
</script>

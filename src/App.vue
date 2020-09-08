<template>
  <div class="quill-box" :style="{ height: fullheight + 'px'}">
    <a-modal v-model="visible" title="秀米" width="90%" :footer="null" :maskClosable="false" :centered="true" :keyboard="false">
      <div v-if="visible">
        <iframe src="./pluging/xiumi-ue-dialog-v5.html" frameborder="0" width="100%" :height="(fullheight - 150)+'px'" id="xiumiIframe"></iframe>
      </div>
    </a-modal>
    <a-modal v-model="visible2" title="135编辑器" width="90%" :footer="null" :maskClosable="false" :centered="true" :keyboard="false">
      <div v-if="visible2">
        <iframe src="./pluging/135EditorDialogPage.html" frameborder="0" width="100%" :height="(fullheight - 150)+'px'" id="xiumiIframe"></iframe>
      </div>
    </a-modal>
    <div class="quill-editor">
      <div id="toolbar" slot="toolbar">
        <!-- Add a bold button -->
        <button class="ql-bold" title="加粗"></button>
        <!-- Add a 秀米 button -->
        <button id="custom-button-xiumi" title="秀米" @click="showModal"></button>
        <!-- Add a 135 button -->
        <button id="custom-button-135" title="135编辑器" @click="showModal2"></button>
      </div>
      <div class="editor" ref="editor"></div>
    </div>
  </div>
</template>

<script>
  // 引入原始组件
  import * as Quill from 'quill'
  // 引入核心样式和主题样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  // 引入自定义blot
  import blotSelect from './components/blot'
  blotSelect(Quill)

export default {
  name: 'quill-xiumi-135',
  props: {
    // 用于双向绑定
    content: String,
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      visible2: false,
      selection: {},
      fullheight: document.documentElement.clientHeight,
      // 待初始化的编辑器
      quill: null,
      options: {
          theme: 'snow',
          modules: {
            // 工具栏的具体配置
            toolbar: "#toolbar",
          },
          placeholder: '请输入内容...'
        }
    }
  },
  mounted () {
    // 初始化编辑器
    this._initEditor()
    window.setRichText = this.setRichText
  },
  methods:{
    // 初始化编辑器
    _initEditor () {
      // 获取编辑器的DOM容器
      let editorDom = this.$el.querySelector('.editor')
      // 初始化编辑器
      this.quill = new Quill(editorDom, this.options)
      // select
      this.quill.on('selection-change', range => {
        this.selection = this.quill.getSelection()
        if (!range) {
          this.$emit('blur', this.quill)
        } else {
          this.$emit('focus', this.quill)
        }
      })
      // 双向绑定
      this.quill.on('text-change', () => {
          this.emitChange()
          this.selection = this.quill.getSelection()
        })
      // 插入内容
      this.firstSetHtml()
      this.listenPaste()
      this.$emit('ready', this.quill)
    },
    firstSetHtml() {
      if(this.value) {
        // 判断是否有秀米和或135元素
        if(this.value.indexOf('xiumi.us') > -1 || this.value.indexOf('135editor.com') > -1 ) {
          let originNode =  new DOMParser().parseFromString(this.value,'text/html').body.childNodes
          this.nodesInQuill(originNode)
        } else {
          // 正常插入
          this.quill.clipboard.dangerouslyPasteHTML(this.value)
        }
      }
    },
    nodesInQuill(originNode) {
      for(let i = originNode.length - 1; i >= 0; i --) {
        if(originNode[i].localName === 'section') {
          this.setRichText(originNode[i].outerHTML, 0)
        } else {
          this.quill.clipboard.dangerouslyPasteHTML(0, originNode[i].outerHTML)
        }
      }
    },
    listenPaste() {
      document.querySelector('.quill-editor').addEventListener('paste', (e) => {
        e.preventDefault(); // 阻止复制动作
        e.stopPropagation();// 阻止冒泡
        const msg = (e.clipboardData || window.clipboardData).getData('text/html') // 获取粘贴板文本
        const value = new DOMParser().parseFromString(msg,'text/html').body.childNodes // 获取nodes
        this.nodesInQuill(value) // 根据不同标签，使用不同的插入方法
      })
    },
    // 更新text-change
    emitChange() {
      let html = this.$refs.editor.children[0].innerHTML
      const quill = this.quill
      const text = this.quill.getText()
      if (html === '<p><br></p>') html = ''
      this.$emit('input', html)
      this.$emit('change', { html, text, quill })
      this.$emit("getConetntLength", this.quill.getLength())
    },
    setRichText(e, t) {
      const index = this.selection?this.selection.index: 0
      this.quill.insertEmbed(t || index, 'AppPanelEmbed', e)
      this.visible = false
      this.visible2 = false
    },
    showModal() {
      this.visible = true
    },
    showModal2() {
      this.visible2 = true
    }
  }
}
</script>

<style>
.quill-editor {
  height: 60%;
}
#toolbar button {
  outline:none
}
#custom-button-xiumi, #custom-button-135 {
  background-size: contain;
  background-repeat: no-repeat;
  height: 16px;
  margin-top: 4px;
  width: 33px;
  padding-right: 8px;
  background-position: center;
  position: relative;
}
#custom-button-xiumi {
  background-image: url('http://xiumi.us/connect/ue/xiumi-connect-icon.png');
}
#custom-button-xiumi:hover {
  background-image: url('http://xiumi.us/connect/ue/xiumi-connect-icon.png');
}
#custom-button-135 {
  background-image: url('http://static.135editor.com/img/icons/editor-135-icon.png');
}
#custom-button-135:hover {
  background-image: url('http://static.135editor.com/img/icons/editor-135-icon.png');
}
</style>

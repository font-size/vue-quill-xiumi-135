# vue-quill-xiumi-135

## 简介

在quill中集成秀米编辑器和135编辑器。

  * 通过在toolbar中添加按钮，以弹窗的方式弹出秀米编辑器和135编辑器。
  * 实现复制进去的秀米等文章也能在quill中正常显示

<a href="http://www.lichengblog.com/demo/vue-quill-xiumi-135/index.html" target="_blank">效果在线预览</a>

## 运行项目

```
npm i

npm run serve
```
## 部分代码

  * 自定义blot（作为防过滤秀米代码的通道），src/components/blot.js

```
export default function (Quill) {
  // 引入源码中的BlockEmbed
  const BlockEmbed = Quill.import('blots/block/embed');
  // 定义新的blot类型
  class AppPanelEmbed extends BlockEmbed {
    static create(value) {
      const node = super.create(value);
      // node.setAttribute('contenteditable', 'false');
      // node.setAttribute('width', '100%');
      // 设置自定义html
      node.innerHTML = this.transformValue(value)
      // 去掉外面的包裹层
      return node.firstChild;
    }

    static transformValue(value) {
      let handleArr = value.split('\n')
      handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
        .replace(/[\s]+$/, ''))
      return handleArr.join('')
    }

    // 返回节点自身的value值 用于撤销操作
    static value(node) {
      return node.innerHTML
    }
  }
  // blotName
  AppPanelEmbed.blotName = 'AppPanelEmbed';
  // class名将用于匹配blot名称
  AppPanelEmbed.className = 'rich-innerHtml';
  // 标签类型自定义
  AppPanelEmbed.tagName = 'div';
  Quill.register(AppPanelEmbed, true);
}
```

  * 在app.vue中使用自定义的blot，src/app.vue

```
  import blotSelect from './components/blot'
  blotSelect(Quill)
```  

  * app.vue（template），src/app.vue

```
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
```  

  * app.vue（部分methods），src/app.vue
  
```
    setRichText(e) { // 通过新blot插入数据
      const index = this.selection?this.selection.index: 0
      this.quill.insertEmbed(index ||  0, 'AppPanelEmbed', e)
      this.visible = false
      this.visible2 = false
    },
    showModal() {
      this.visible = true
    },
``` 

  * 修改秀米html中js，public\pluging\xiumi-ue-dialog-v5.html

```
    // 可以删掉页面上的internal.js引用了
    var parent = window.parent;
    var xiumi = document.getElementById('xiumi');
    var xiumi_url = window.location.protocol + "//xiumi.us";
    xiumi.onload = function () {
        console.log("postMessage");
        xiumi.contentWindow.postMessage('ready', xiumi_url);
    };
    document.addEventListener("mousewheel", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
    window.addEventListener('message', function (event) {
        if (event.origin == xiumi_url) {
            parent.setRichText(event.data) // ++ setRichText是app.vue暴露出来的把数据插入quill的全局方法
            // editor.execCommand('insertHtml', event.data); --
            // dialog.close(); --
        }
    }, false);
```   
## tips

- 秀米官方更新后，在本地开发环境时，无法正常插入数据到编辑器；且在ip环境下无法登录秀米。
- 秀米里的图片插入编辑器前需要做本地化处理，不然无法正常显示图片（被秀米锁图）。

### 资源

<a href="https://xiumi.us/" target="_blank">秀米官网</a><br>
<a href="http://www.135plat.com/open_editor.html" target="_blank">135编辑器</a><br>
<a href="https://github.com/quilljs/parchment#blots" target="_blank">https://github.com/quilljs/parchment#blots</a><br>

## License

<a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a>

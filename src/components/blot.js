export default function (Quill) {
  // 引入源码中的BlockEmbed
  const BlockEmbed = Quill.import('blots/block/embed');
  // 定义新的blot类型
  class AppPanelEmbed extends BlockEmbed {
    static create(value) {
      const node = super.create(value);
      // node.setAttribute('contenteditable', 'false');
      // node.setAttribute('width', '100%');
      //   设置自定义html
      node.innerHTML = this.transformValue(value)
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
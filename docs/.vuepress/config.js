module.exports = {
  title: '@vuepress/plugin-blog',
  description: 'Official blog plugin for VuePress',
  themeConfig: {
    repo: 'vuepressjs/vuepress-plugin-blog',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      { text: 'Pagination', link: '/pagination/' },
      { text: 'Client API', link: '/client-api/' },
      { text: 'Components', link: '/components/' },
      { text: 'FAQ', link: '/faq/' }
    ],
    sidebarDepth: 3,
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,

          children: [
            '',
            'getting-started',
          ],
        },
      ],
    },
    smoothScroll: true,
  },
}


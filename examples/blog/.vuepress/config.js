module.exports = {
  title: `ULIVZ`,
  plugins: [
    [require('../../../lib/node'), {
      directories: [
        {
          // Unique ID of current classification
          id: 'post',
          // Target directory
          dirname: '_posts',
          // Path of the `entry page` (or `list page`)
          path: '/',
          pagination: {
            lengthPerPage: 2,
          },
        },
        {
          id: 'archive',
          dirname: '_archive',
          path: '/archive/',
          // layout: 'IndexArchive', defaults to `Layout.vue`
          itemLayout: 'Post',
          itemPermalink: '/archive/:year/:month/:day/:slug',
        },
      ],
      frontmatters: [
        {
          id: "tag",
          keys: ['tag', 'tags'],
          path: '/tag/',
          // layout: 'Tag', defaults to `FrontmatterKey`.
          frontmatter: { title: 'Tag' },
        },
        {
          id: "location",
          keys: ['location'],
          path: '/location/',
          // layout: 'Location', defaults to `FrontmatterKey`.
          frontmatter: { title: 'Location' },
        }
      ],
      globalPagination: {
        lengthPerPage: 5
      }
    }],
  ],
}

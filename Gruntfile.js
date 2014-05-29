var pkg = require('./package');

var minorVersion = pkg.version.replace(/\.(\d)*$/, '');
var majorVersion = pkg.version.replace(/\.(\d)*\.(\d)*$/, '');
var path = require('path');

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    clean: [
      'release/'
    ],

    copy: {
      release: {
        files: [{
          expand: true,
          flatten: true,
          src: ['index.css', 'index.html'],
          dest: 'release/'
        }]
      }
    },

    s3: {
      options: {
        key:    process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        bucket: process.env.S3_BUCKET,
        access: 'public-read',
        headers: {
          'Cache-Control':  'public, max-age=300'
        }
      },
      clean: {
        del: [
          { src:     'widget-theme-reflex-' + majorVersion + '/index.html', },
          { src:     'widget-theme-reflex-' + majorVersion + '/index.css', },
          { src:     'widget-theme-reflex-' + minorVersion + '/index.html', },
          { src:     'widget-theme-reflex-' + minorVersion + '/index.css', },
          { src:     'widget-theme-reflex-' + pkg.version  + '/index.html', },
          { src:     'widget-theme-reflex-' + pkg.version  + '/index.css', },
          { src:     'widget-theme-reflex/index.html', },
          { src:     'widget-theme-reflex/index.css', },
        ]
      },
      publish: {
        upload: [{
          src:    'release/*',
          dest:   'widget-theme-reflex-' + minorVersion + '/',
          options: { gzip: false }
        }, {
          src:    'release/*',
          dest:   'widget-theme-reflex-' + majorVersion + '/',
          options: { gzip: false }
        }, {
          src:    'release/*',
          dest:   'widget-theme-reflex-' + pkg.version + '/',
          options: { gzip: false }
        }, {
          src:    'release/*',
          dest:   'widget-theme-reflex/',
          options: { gzip: false }
        }]
      }
    },
    maxcdn: {
      purgeCache: {
        options: {
          companyAlias:   process.env.MAXCDN_COMPANY_ALIAS,
          consumerKey:    process.env.MAXCDN_CONSUMER_KEY,
          consumerSecret: process.env.MAXCDN_CONSUMER_SECRET,
          zone_id:        process.env.MAXCDN_ZONE_ID,
          method:         'delete'
        },
        files: [
          { src:     'widget-theme-reflex-' + majorVersion + '/index.html', },
          { src:     'widget-theme-reflex-' + majorVersion + '/index.css', },
          { src:     'widget-theme-reflex-' + minorVersion + '/index.html', },
          { src:     'widget-theme-reflex-' + minorVersion + '/index.css', },
          { src:     'widget-theme-reflex-' + pkg.version  + '/index.html', },
          { src:     'widget-theme-reflex-' + pkg.version  + '/index.css', },
          { src:     'widget-theme-reflex/index.html', },
          { src:     'widget-theme-reflex/index.css', }
        ],
      },
    }
  });

  grunt.registerTask('build', ['clean', 'copy']);
  grunt.registerTask('cdn', ['build', 's3', 'maxcdn']);
  grunt.registerTask('default', ['build']);
};

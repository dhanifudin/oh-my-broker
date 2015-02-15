module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /* bower_concat task {{{ */
    bower_concat: {
      all: {
        dest: 'public/js/lib.js',
        cssDest: 'public/css/assets.css',
        mainFiles: {
          'leaflet.draw': [
            'dist/leaflet.draw.css',
            'dist/leaflet.draw.js'
          ]
        },
        exclude: [
          'jquery',
          'bootstrap'
        ],
        bowerOptions: {
          relative: false
        }
      }
    },
    /* }}} bower_concat task */

    /* copy task {{{ */
    copy: {
      leaflet: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'bower_components/leaflet.draw/dist/images/*',
        dest: 'public/css/images/',
      },
    },
    /* }}} copy task */

    /* less task {{{ */
    less: {
      dev: {
        options: {
          compress: false
        },
        files: {
          'public/css/style.css': 'less/style.less'
        }
      },
      production: {
        options: {
          compress: true
        },
        files: {
          'public/css/style.min.css': 'less/style.less'
        }
      }
    },
    /* }}} less task */

    /* concat task {{{ */
    concat: {
      options: {
        separator: ';',
      },
      mqtt: {
        src: [
          'public/js/lib.js',
          'node_modules/mqtt'
        ]
      },
      ng: {
        src: [
          'src/js/lib/*.js',
          'src/js/*.js'
        ],
        dest: 'public/js/app.js'
      }
    },
    /* }}} concat task */

    /* uglify task {{{ */
    uglify: {
      app: {
        files: {
          'public/js/app.min.js': [
            'public/js/bower.js',
            'public/js/app.js'
          ]
        }
      }
    },
    /* }}} uglify task */

    /* nodemon {{{ */
    nodemon: {
      dev: {
        script: 'app.js',
        ignore: [
          'node_modules/**',
          'bower_components/**'
        ]
      }
    }
    /* }}} nodemon */
  });
  grunt.registerTask('default', ['bower_concat', 'concat', 'uglify', 'stylus']);
  grunt.registerTask('dev', ['bower_concat', 'concat']);
};

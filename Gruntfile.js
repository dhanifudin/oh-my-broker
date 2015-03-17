module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* bower_concat task {{{ */
    bower_concat: {
      tracking: {
        dest: 'public/js/tracking/lib.js',
        cssDest: 'public/css/tracking/assets.css',
        mainFiles: {
          'Leaflet.label': [
            'dist/leaflet.label.css',
            'dist/leaflet.label.js'
          ]
        },
        exclude: [
          'font-awesome',
          'leaflet.draw',
          'leaflet-routing-machine'
        ],
        dependencies: {
          'Leaflet.label': 'leaflet'
        },
        bowerOptions: {
          relative: false
        }
      },
      marker: {
        dest: 'public/js/marker/lib.js',
        cssDest: 'public/css/marker/assets.css',
        mainFiles: {
          'leaflet.draw': [
            'dist/leaflet.draw.css',
            'dist/leaflet.draw.js'
          ],
          'Leaflet.label': [
            'dist/leaflet.label.css',
            'dist/leaflet.label.js'
          ],
          'leaflet-routing-machine': [
            'dist/leaflet-routing-machine.css',
            'dist/leaflet-routing-machine.js'
          ]
        },
        exclude: [
          'font-awesome'
        ],
        dependencies: {
          'Leaflet.label': 'leaflet'
        },
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
        src: 'bower_components/leaflet/dist/images/*',
        dest: 'public/img',
      },
      draw: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'bower_components/leaflet.draw/dist/images/*',
        dest: 'public/css/marker/images',
      },
      routing: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'bower_components/leaflet-routing-machine/dist/leaflet.routing.icons.png',
        dest: 'public/css/marker',
      },
    },
    /* }}} copy task */

    /* less task {{{ */
    less: {
      tracking: {
        options: {
          compress: false
        },
        files: {
          'public/css/tracking/style.css': 'less/tracking/style.less'
        }
      },
      marker: {
        options: {
          compress: false
        },
        files: {
          'public/css/marker/style.css': 'less/marker/style.less'
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
  grunt.registerTask('default', ['bower_concat', 'less']);
  grunt.registerTask('dev', ['bower_concat', 'less', 'concat']);
};

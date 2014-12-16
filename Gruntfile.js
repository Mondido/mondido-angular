'use strict';
module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
      build: {
        src: ['src/mondido.js', 'src/**/*.js'],
        dest: 'mondido-angular.min.js'
      }
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['uglify'],
      options: {
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};

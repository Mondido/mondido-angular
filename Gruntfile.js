'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
      build: {
        src: 'src/mondido.js',
        dest: 'mondido-angular.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};

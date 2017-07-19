"use strict"

const gulp = require('gulp'),
      babelify = require('babelify'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      watchify = require('watchify'),
      rename = require('gulp-rename'),
      sourceMaps = require('gulp-sourcemaps'),
        livereload = require('gulp-livereload'),
      gutil = require('gulp-util');


      var config = {
          js: {
              src: './src/app.js',       // Entry point
              outputDir: './dist/',  // Directory to save bundle to
              mapDir: './maps/',      // Subdirectory to save maps to
              outputFile: 'bundle.js' // Name to use for bundle
          },
      };

      // This method makes it easy to use common bundling options in different tasks
      function bundle (bundler) {

          // Add options to add to "base" bundler passed as parameter
          bundler
            .bundle()                                           // Start bundle
            .pipe(source(config.js.src))                        // Entry point
            .pipe(buffer())                                     // Convert to gulp pipeline
            .pipe(rename(config.js.outputFile))                  // Rename output from 'main.js'
                                                                //   to 'bundle.js'
            .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
            .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their  own directory

            .pipe(gulp.dest(config.js.outputDir))        // Save 'bundle' to build/
            .pipe(livereload())                         // Reload browser if relevant
            .on('end', () => gutil.log(gutil.colors.green('==> Successful Bundle!')));
      }

      gulp.task('bundle', function () {
          var bundler = browserify(config.js.src)  // Pass browserify the entry point
                                      .plugin(watchify) 
                                      .transform(babelify, { presets : [ 'es2015' ] });  // Then, babelify, with ES2015 preset

          bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
          bundler.on('update', () => bundle(bundler));
      });

      gulp.task('default',['bundle']);

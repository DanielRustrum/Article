const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"))
const pug = require("gulp-pug")
const ts = require("gulp-typescript")
const path = require("path")
const fs = require("fs")

const browserSync = require('browser-sync').create();
const config_data = require("../config.json")

let project_path = path.join(__dirname, config_data["project-path"])
let build_path = path.join(__dirname, config_data["build-path"])


const scss_to_css = cb => {
    return gulp.src(`${project_path}/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${build_path}`))
}

const pug_to_html = cb => {
    return gulp.src(`${project_path}/*.pug`)
        .pipe(
            pug({
                blade: false,
                src:  `${project_path}/components`,
                search: '**/*.pug',
                pugExtension: '.pug',
            })
        )
        .pipe(gulp.dest(`${build_path}/`))
}

const ts_to_js = cb => {
    return gulp.src(`${project_path}/*.ts`)
        .pipe(
            ts({
                outDir: `${build_path}`
            })
        )
        .pipe(gulp.dest(`${build_path}/`))
}

const move_other_files = () => {
    let filesToMove = [
        `${project_path}/assets/**/*.*`,
        `${project_path}/*.json`,
        `${project_path}/*.js`,
        `${project_path}/*.css`,
        `${project_path}/*.html`,
        `${project_path}/lib`,
        `${project_path}/js`,
    ];

    gulp
        .src(filesToMove, { base: project_path })
        .pipe(gulp.dest(build_path));
}

const clean_build = _ => {
    fs.rmdirSync(build_path, {
        recursive: true
    })
    fs.mkdirSync(build_path)

}

const on_project_change = () => {
    move_other_files()
    browserSync.reload()
}

exports.style = scss_to_css
exports.html = pug_to_html
exports.script = ts_to_js
exports.clean = clean_build

exports.default = () => {
    clean_build()
    pug_to_html()
    scss_to_css()
    ts_to_js()
    move_other_files()

    browserSync.init({
        server: build_path
    })

    gulp
        .watch(`${project_path}`)
        .on('unlink', clean_build)
        .on('change', gulp.series(gulp.parallel(pug_to_html, scss_to_css, ts_to_js), on_project_change))
        .on('add', gulp.series(gulp.parallel(pug_to_html, scss_to_css, ts_to_js), on_project_change))
}

exports.compile = () => {
    clean_build()
    pug_to_html()
    scss_to_css()
    ts_to_js()
    move_other_files()
}

exports.publish = () => {
    clean_build()
    pug_to_html()
    scss_to_css()
    ts_to_js()
    move_other_files()
}
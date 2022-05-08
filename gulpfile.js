import gulp from 'gulp'
import fs from 'fs'
import pugCompiler from 'gulp-pug'
import prettier from 'gulp-prettier'
import plumber from 'gulp-plumber'
import fonter from 'gulp-fonter'
import ttf2woff2 from 'gulp-ttf2woff2'
import imagemin from 'gulp-imagemin'
import svgo from 'gulp-svgo'
import webp from 'gulp-webp'
import htmlMin from 'gulp-htmlmin'
import webpInHtml from 'gulp-webp-html-nosvg'
import cleanCss from 'gulp-clean-css'
import gcmq from 'gulp-group-css-media-queries'


const path = {
	root: {
		src: './src',
		build: './build'
	},
	src: {
		pug: './src/*.pug',
		html: './src/*.html',
		css: './src/style.css',
		js: './src/scripts.js',
		fonts: {
			src: './src/fontsSrc/',
			converted: './src/fonts/'
		},
		img: './src/img/'
	},
	watch: {
		pug: {
			main: './src/*.pug',
			chunks: './src/pug/**/*.pug',
		}
	},
	build: {
		img: './build/img/',
		html: './build/',
		css: './build/',
		js: './build/',
		fonts: './build/fonts/'
	}
}


/* pug-------------------------------*/
export const pug = () => {
	return gulp
		.src(path.src.pug)
		.pipe(plumber())
		.pipe(pugCompiler({
			pretty: true
		}))
		.pipe(prettier())
		.pipe(plumber.stop())
		.pipe(gulp.dest(path.root.src))
}

export const pugWatch = () => {
	gulp.watch(path.watch.pug.main, pug)
	gulp.watch(path.watch.pug.chunks, pug)
} 

/* end of pug-----------------------*/

/* fonts----------------------------*/
export const otfToTtf = () => {
  return gulp
    .src(`${path.src.fonts.src}*.otf`, {})
    .pipe(plumber())
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
		.pipe(plumber.stop())
    .pipe(gulp.dest(path.src.fonts.src));
};

export const ttfToWoff = () => {
  return gulp
    .src(`${path.src.fonts.src}*.ttf`, {})
    .pipe(plumber())
    .pipe(
      fonter({
        formats: ["woff"],
      })
    )
		.pipe(plumber.stop())
    .pipe(gulp.dest(path.src.fonts.converted))
    .pipe(gulp.src(`${path.src.fonts.src}*.ttf`, {}))
		.pipe(plumber())
    .pipe(ttf2woff2())
		.pipe(plumber.stop())
    .pipe(gulp.dest(path.src.fonts.converted));
};

export const fontStyle = () => {
  let fontsFile = `${path.root.src}/_fonts.scss`;
  fs.readdir(path.src.fonts.converted, function (err, fontsFiles) {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, "", cb);
        let newFileOnly;
        for (var i = 0; i < fontsFiles.length; i++) {
          let fontFileName = fontsFiles[i].split(".")[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split("-")[0]
              ? fontFileName.split("-")[0]
              : fontFileName;
            let fontWeight = fontFileName.split("-")[1]
              ? fontFileName.split("-")[1]
              : fontFileName;
            switch (fontWeight.toLowerCase()) {
              case "thin":
                fontWeight = 100;
                break;
              case "extralight":
                fontWeight = 200;
                break;
              case "light":
                fontWeight = 300;
                break;
              case "regular":
                fontWeight = 400;
                break;
              case "medium":
                fontWeight = 500;
                break;
              case "semibold":
                fontWeight = 600;
                break;
              case "bold":
                fontWeight = 700;
                break;
              case "extrabold":
                fontWeight = 800;
                break;
              case "black":
                fontWeight = 900;
                break;
              default:
                fontWeight = 400;
            }
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("./fonts/${fontFileName}.woff") format("woff"), url("./fonts/${fontFileName}.woff2") format("woff2");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
              cb
            );
            newFileOnly = fontFileName;
          }
        }
      } else {
        console.log(
          "Файл scss/fonts уже существует. Для обновления файла его нужно удалить"
        );
      }
    }
  });
  return gulp.src(`./`);
  function cb() {}
};

export const fonts = gulp.series(otfToTtf, ttfToWoff, fontStyle)
export const fontsBuild = () => {
	return gulp
		.src(`${path.src.fonts.converted}*.*`)
		.pipe(gulp.dest(path.build.fonts))
}

/* end of fonts---------------------*/

/* images---------------------------*/
export const copyImages = () => {
	return gulp
	.src(`${path.src.img}**/*.{jpg,jpeg,png,gif,webp,svg}`)
	.pipe(gulp.dest(path.build.img));
}

export const cleanSvg = () => {
	return gulp
	.src([`${path.build.img}**/*.svg`,`!${path.build.img}sprites/**/*.*`])
	.pipe(plumber())
	.pipe(svgo())
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.build.img))
}

export const createWebp = () => {
	return gulp
	.src(`${path.build.img}**/*.{jpg,jpeg,png,gif}`)
	.pipe(plumber())
	.pipe(webp())
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.build.img));
}

export const imagesMinification = async () => {
  return gulp
    .src(`${path.build.img}**/*.{jpg,jpeg,png,gif,webp}`)
    .pipe(plumber())
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest(path.build.img));
};

export const imagesWithWebp = gulp.series(copyImages, cleanSvg, createWebp, imagesMinification)
export const imagesWithoutWebp = gulp.series(copyImages, cleanSvg, imagesMinification)
/* end of images--------------------*/

/* html-----------------------------*/
export const copyHtml = () => {
	return gulp
	.src(path.src.html)
	.pipe(gulp.dest(path.build.html))

}
export const htmlMinification = () => {
	return gulp
	.src(`${path.build.html}/*.html`)
	.pipe(plumber())
	.pipe(htmlMin({
		removeComments: true,
		collapseWhitespace: true
	}))
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.build.html))
}

export const webpHtml = () => {
	return gulp
	.src(`${path.build.html}/*.html`)
	.pipe(plumber())
	.pipe(webpInHtml())
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.build.html))
}

export const htmlBuild = gulp.series(copyHtml, htmlMinification)
export const htmlWebpBuild = gulp.series(copyHtml, webpHtml, htmlMinification)
/* end of html----------------------*/

/* css------------------------------*/
export const minifyCss = () => {
	return gulp
		.src(path.src.css)
		.pipe(plumber())
		.pipe(cleanCss())
		.pipe(plumber.stop())
		.pipe(gulp.dest(path.build.css))
}

export const groupMedia = () => {
	return gulp
		.src(path.src.css)
		.pipe(plumber())
		.pipe(gcmq())
		.pipe(plumber.stop())
		.pipe(gulp.dest(path.root.src))
}

export const cssBuild = gulp.series(groupMedia, minifyCss)

/* end of css-----------------------*/

/*js--------------------------------*/
export const copyJs = () => {
	return gulp
		.src(path.src.js)
		.pipe(gulp.dest(path.build.js))
}
/* copy js--------------------------*/

/* build----------------------------*/
export const build = gulp.series(htmlBuild, cssBuild, fontsBuild, imagesWithoutWebp, copyJs)
export const buildWebp = gulp.series(htmlWebpBuild, cssBuild, fontsBuild, imagesWithWebp, copyJs)
/* end of build---------------------*/
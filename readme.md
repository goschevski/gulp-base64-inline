# Inline images via base64

This gulp plugin inline images via base64. It inlines only images you want. Wrap image name with inline function in source code.

```javascript
var gulp = require('gulp');
var base64 = require('gulp-base64-inline');

gulp.task('css', function () {
    return gulp.src('css/style.css')
        .pipe(base64('../assets/img'))
        .pipe(gulp.dest('assets/css/'));
    }
);
```

Source:

```css
.star {
    background: inline('star.svg');
}
```

Result:

```css
.star {
    background: url(data:image/svg;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjQzIiB2aWV3Qm94PSIwIDAgNDUgNDMiIHdpZHRoPSI0NSI+PHN2ZyBoZWlnaHQ9IjMzIiB2aWV3Qm94PSIwIDAgMzUgMzMiIHdpZHRoPSIzNSIgeD0iNSIgeT0iNSI+PHRpdGxlPnN0YXI8L3RpdGxlPjxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPjxwYXRoIHN0cm9rZT0iIzk3OTc5NyIgZmlsbD0iI0Q4RDhEOCIgZD0iTTE3LjUgMjYuMjVMNy4yMTQgMzEuNjU4bDEuOTY0LTExLjQ1NC04LjMyLTguMTEyIDExLjUtMS42N0wxNy41IDBsNS4xNDMgMTAuNDIgMTEuNSAxLjY3Mi04LjMyIDguMTEyIDEuOTYzIDExLjQ1NHoiLz48L3N2Zz48L3N2Zz4=);
}
```

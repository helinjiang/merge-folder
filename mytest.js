/**
 * [文件描述]
 *
 * @author helinjiang
 * @date 2015/11/19
 */

var fs = require('fs');
var mergeFolder = require('./index');
var _ = require('underscore');
//var walkSync = require('walk-sync');

// 测试getSameName
function testGetSameName() {
    var paths = 'test/fixtures',
        getSameNameResult = mergeFolder.getSameName(paths);

    if (_.isEmpty(getSameNameResult)) {
        console.log('没有重名的文件！');
    } else {
        for (var fileName in getSameNameResult) {
            var existArr = getSameNameResult[fileName],
                tArr = [];

            tArr.push('\n' + fileName + '存在' + existArr.length + '份：');
            existArr.forEach(function (item, index) {
                tArr.push('\n' + index + ':' + item.fullPath + ', ' + 'size=' + item.size + ', mtime=' + item.mtime);
            });

            console.log(tArr.join(''));
        }
    }
}

// 测试getSameSize
function testGetSameSize() {
    var paths = 'test/fixtures',
        getSameSizeeResult = mergeFolder.getSameSize(paths);

    if (_.isEmpty(getSameSizeeResult)) {
        console.log('没有相同文件大小的文件！');
    } else {
        for (var fileSize in getSameSizeeResult) {
            var existArr = getSameSizeeResult[''+fileSize],
                tArr = [];

            tArr.push('\n' + fileSize + '存在' + existArr.length + '份：');
            existArr.forEach(function (item, index) {
                tArr.push('\n' + index + ':' + item.fullPath + ', ' + 'size=' + item.size + ', mtime=' + item.mtime);
            });

            console.log(tArr.join(''));
        }
    }
}

// 测试getSameMd5
function testGetSameMd5() {
    var paths = 'test/fixtures',
        getSameMd5Result = mergeFolder.getSameMd5(paths);

    if (_.isEmpty(getSameMd5Result)) {
        console.log('没有重名的文件！');
    } else {
        //console.log(getSameMd5Result);
        for (var fileName in getSameMd5Result) {
            var existArr = getSameMd5Result[fileName],
                tArr = [];

            tArr.push('\n' + fileName + '存在' + existArr.length + '份：');
            existArr.forEach(function (item, index) {
                tArr.push('\n' + index + ':' + item.fullPath + ', ' + 'size=' + item.size + ', mtime=' + item.mtime);
            });

            console.log(tArr.join(''));
        }
    }
}

// 测试getAllFile
function testGetAllFile() {
    var paths = 'test/fixtures',
        getAllFileResult = mergeFolder.getAllFile(paths);

    if (!getAllFileResult.length) {
        console.log('没有重名的文件！');
    } else {
        var arr = [];
        getAllFileResult.forEach(function (item) {
            var tarr = [];
            tarr.push(item.relativePath);
            tarr.push(item.size);
            tarr.push(item.mtime);

            arr.push(tarr.join('|'));
        });
        console.log(arr.join('\n'));
        fs.writeFile('./data.txt', arr.join('\n'), function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });
    }
}

var t1 = new Date().getTime();
//testGetSameMd5();
//testGetSameName();
testGetSameSize();
//testGetAllFile();
var t2 = new Date().getTime();
console.log("cost:" + (t2 - t1));

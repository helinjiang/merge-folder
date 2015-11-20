/**
 * [文件描述]
 *
 * @author helinjiang
 * @date 2015/11/19
 */
var walkSync = require('walk-sync');
var fs = require("fs");
var path = require("path");
var util = require("./lib/util");
var _ = require('underscore');

/**
 * 文件对象
 * TODO 考虑是否要加入mode权限
 * @param basePath
 * @param relativePath
 * @param size
 * @param mtime
 * @constructor
 */
function FileItem(basePath, relativePath, size, mtime) {
    this.basePath = basePath;
    this.relativePath = relativePath;
    this.size = size;
    this.mtime = mtime;

    this.fileName = path.basename(this.relativePath);
    this.fullPath = path.join(this.basePath, this.relativePath);
    this.md5 = '';
}

/**
 * 获得某路径下所有的文件。
 * @param {String} paths 路径
 * @return {Array} 结果，每个数组的元素为FileItem。
 */
function getAllFile(paths) {
    var entry = walkSync.entries(paths, {directories: false});

    var result = [];
    entry.forEach(function (item) {
        var fileItem = new FileItem(item.basePath, item.relativePath, item.size, item.mtime);
        result.push(fileItem);
    });

    return result;
}

/**
 * 获得某路径下所有同名的重复文件信息。
 * @param {String} paths 路径
 * @return {Object} 结果，key值为文件名，value值为数组，每个数组的元素为FileItem。
 */
function getSameName(paths) {
    var entry = walkSync.entries(paths, {directories: false});

    var map = {},
        multiNameArr = [],
        result = {};

    entry.forEach(function (item) {
        var fileItem = new FileItem(item.basePath, item.relativePath, item.size, item.mtime),
            fileName = fileItem.fileName;

        var curItemArr = map[fileName];
        if (curItemArr) {
            multiNameArr.push(fileName);
        } else {
            curItemArr = [];
            map[fileName] = curItemArr;
        }

        curItemArr.push(fileItem);
    });

    if (multiNameArr.length) {
        multiNameArr.forEach(function (fileName) {
            result[fileName] = map[fileName];
        });
    }

    return result;
}

/**
 * 获得某路径下所有相同文件大小的重复文件信息。
 * @param {String} paths 路径
 * @return {Object} 结果，key值为文件大小，value值为数组，每个数组的元素为FileItem。
 */
function getSameSize(paths) {
    var entry = walkSync.entries(paths, {directories: false});

    var map = {},
        multiNameArr = [],
        result = {};

    entry.forEach(function (item) {
        var fileItem = new FileItem(item.basePath, item.relativePath, item.size, item.mtime),
            fileSizeName = '' + fileItem.size;

        var curItemArr = map[fileSizeName];
        if (curItemArr) {
            multiNameArr.push(fileSizeName);
        } else {
            curItemArr = [];
            map[fileSizeName] = curItemArr;
        }

        curItemArr.push(fileItem);
    });

    if (multiNameArr.length) {
        multiNameArr.forEach(function (fileSizeName) {
            result[fileSizeName] = map[fileSizeName];
        });
    }

    return result;
}

/**
 * 获得某路径下md5值相同的重复文件信息。
 * @param {String} paths 路径
 * @return {Object} 结果，key值为md5值，value值为数组，每个数组的元素为FileItem。
 */
function getSameMd5(paths) {
    var entry = walkSync.entries(paths, {directories: false});

    var map = {},
        multiNameArr = [],
        result = {};

    entry.forEach(function (item) {
        var fileItem = new FileItem(item.basePath, item.relativePath, item.size, item.mtime),
            md5 = util.getHashOfFile(fileItem.fullPath);
        // TODO 注意，如果文件比较多的话，此处每个文件做hash会比较耗时，尤其是文件也相对比较大时，情况更严重
        // 我尝试过遍历包含703张图片，结果耗时189.3s图片，平均一张耗时：269ms;
        // 10M的视频400ms左右；1.55M图片126ms
        // 10M的视频290ms左右；1.55M图片50ms
        fileItem.md5 = md5;

        var curItemArr = map[md5];
        if (curItemArr) {
            multiNameArr.push(md5);
        } else {
            curItemArr = [];
            map[md5] = curItemArr;
        }

        curItemArr.push(fileItem);
    });

    if (multiNameArr.length) {
        multiNameArr.forEach(function (md5) {
            result[md5] = map[md5];
        });
    }

    return result;
}

/**
 * 获取某路径下的所有文件信息，并保存起来
 * @param {String} targetPath 目标路径
 * @param {String} savePath 保存文件的路径
 * @param {String} itemTpl 保存文件中每一行的数据模版
 */
function saveAllFileInfo(targetPath, savePath, itemTpl) {
    var getAllFileResult = getAllFile(targetPath),
        itemTplStr = itemTpl || '<%=fullPath%>|<%=size%>|<%=mtime%>';

    if (!getAllFileResult.length) {
        console.error('Can not find any file in ' + targetPath);
    } else {
        var arr = [];
        getAllFileResult.forEach(function (item) {
            var template = _.template(itemTplStr);

            arr.push(template(item));
        });

        fs.writeFile(savePath, arr.join('\n'), function (err) {
            if (err) throw err;
            console.log('Get files from %s and save info in %s success!', targetPath, savePath);
        });
    }
}

module.exports = {
    getAllFile: getAllFile,
    getSameName: getSameName,
    getSameSize: getSameSize,
    getSameMd5: getSameMd5,
    saveAllFileInfo: saveAllFileInfo
};


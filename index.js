/**
 * [文件描述]
 *
 * @author helinjiang
 * @date 2015/11/19
 */
var walkSync = require('walk-sync');
var path = require("path");
var util = require("./lib/util");

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

module.exports = {
    getAllFile: getAllFile,
    getSameName: getSameName,
    getSameMd5: getSameMd5
}


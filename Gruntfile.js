module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            // path info
            path: {
                release: "dist/",
                merged: "dist/merged/",
                source: {
                    desktop: "src/desktop/",
                    mobile: "src/mobile/",
                    polyfill: "src/polyfill/",
                    patch: "src/patch/",
                    i18n: "src/i18n"
                }
            },

            // API doc url
            docurl: "http://jindo.dev.naver.com/docs/jindo/<%= pkg.version %>/desktop/ko/classes/jindo."
        },
        meta: {
            banner: '/**\n' +
                 '* <%= pkg.name.replace(/-/g," ") %>\n' +
                 '* @type {{type}}\n' +
                 '* @version <%= pkg.version %>\n' +
                 '* \n' +
                 '* <%= pkg.description %>\n' +
                 '* http://jindo.dev.naver.com/\n' +
                 '* \n' +
                 '* Released under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license\n' +
                 '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
                 '*/\n\n',
        },
        metafile: {
            options: {
                prefix: { desktop: "a", mobile: "b" },
                filekey: {
                    "polyfill.js": "0",
                    "core.js": "a",
                    "cssquery.js": "b",
                    "cssquery.mobile.js": "c",
                    "agent.js": "d",
                    "array.js": "e",
                    "array.extend.js": "f",
                    "hash.js": "g",
                    "function.js": "h",
                    "event.js": "i",
                    "element.js": "j",
                    "element.extend.js": "k",
                    "elementlist.js": "l",
                    "form.js": "m",
                    "document.js": "n",
                    "window.js": "o",
                    "string.js": "p",
                    "json.js": "q",
                    "ajax.js": "r",
                    "ajax.extend.js": "s",
                    "date.js": "t",
                    "cookie.js": "u",
                    "template.js": "v",
                    "template.extend.js": "w",
                    "namespace.js": "x",
                    "noconflict.js": "z"
                }
            }
        },

        concat: {
            options: {
                separator: '\n\n',
                list: {
                    release: [ "jindo.desktop.js", "jindo.desktop.ns.js", "jindo.mobile.js", "jindo.mobile.ns.js" ],
                    polyfill: [ '<%= config.path.source.polyfill %>util.js', '<%= config.path.source.polyfill %>array.js', '<%= config.path.source.polyfill %>function.js', '<%= config.path.source.polyfill %>timer.js' ],
                    patch: ['<%= config.path.source.patch %>common.fn.js', '<%= config.path.source.patch %>core.js', '<%= config.path.source.patch %>event.js', '<%= config.path.source.patch %>function.js'],
                    all: [ "polyfill.js", "core.js", "cssquery.js", "agent.js", "array.js", "array.extend.js", "ajax.js", "ajax.extend.js", "hash.js", "json.js", "cookie.js", "event.js", "element.js", "element.extend.js", "function.js", "elementlist.js", "string.js", "document.js", "form.js", "template.js", "template.extend.js", "date.js", "window.js" ]
                }
            },
            polyfill: {
                options: {
                    banner: "/**\n{{title}}\n*/\n",
                },
                files: [
                    { src: '<%= concat.options.list.polyfill %>', dest: '<%= config.path.source.desktop %>polyfill.js' },
                    { src: '<%= concat.options.list.polyfill %>', dest: '<%= config.path.source.mobile %>polyfill.js' }
                ]
            },
            patch: {
                options: {
                    banner: "/**\n{{title}}\n*/\n",
                },
                files: [
                    { src: '<%= concat.options.list.patch %>', dest: '<%= config.path.source.desktop %>patch.js' },
                    { src: '<%= concat.options.list.patch %>', dest: '<%= config.path.source.mobile %>patch.js' }
                ]
            },
            release: {
                files: []
            }
        },

        clean: {
            build: [ '<%= config.path.release %>**/*.tmp' ],
            dist1 : [ '<%= config.path.release %>/desktop', '<%= config.path.release %>/mobile' ],
            dist2 : [ '<%= config.path.merged %>' ]
        },

        uglify: {
            options: {
                mangle: {
                    except: ['jindo']
                },
                compress: {
                    drop_console: true
                }
            },
            release : {
                files: [{
                    expand: true,
                    cwd: '<%= config.path.merged %>',
                    dest: '<%= config.path.merged %>',
                    src: ['**/*.js', '!**/*.min.js'],
                    rename: function(dest, src) {
                        return dest + src.replace(/\.js$/, '.min.js');
                    }
                }]
            }
        },

        exec: {
            auidoc: {
                cmd: function(sType, sLang) {
                    var oData = {
                        data: {
                            type: sType,
                            lang: sLang
                        }};

                    return grunt.template.process('node node_modules/auidocjs/lib/cli.js --config build/api/config/<%= type %>/auidoc-<%= type %>-<%= lang %>.json '+ grunt.config("config.path.release") +'<%= type %>/<%= lang %>', oData);
                },
				stdout: false
			},

			gitlog: {
			    cmd: function() {
			        var sBefore = grunt.config("pkg.build.changelog.before");

			        if(!sBefore || sBefore == "now") {
			            sBefore = grunt.template.today("yyyy-mm-dd");
			        }

                    return 'git log --grep="<log>" --after={'+ grunt.config("pkg.build.changelog.after") +'} --before={'+ sBefore +'} --format="<item><hash>%H</hash>%s%b</item>" --no-merges';
			    },
			    callback: function(error, stdout, stderr) {
                    var xml2js = require('xml2js'),
                        parser = new xml2js.Parser(),
                        aLogData = [];

                    parser.parseString("<logs>"+ stdout.replace(/<\/?log>/g, "") +"</logs>", function(err, result) {
                        if(!result.logs.item) {
                            return;
                        }

                        var fp = function(v) { return v.trim() };

                        for(var i=0, el; el = result.logs.item[i]; i++) {
                            aLogData.push({
                                rno: el.hash[0],
                                type: el.type[0],
                                coverage: el.coverage[0].split(",").map(fp),
                                bts: el.bts[0],
                                desc: el.desc[0],
                                level: el.level[0],
                                method: el.method[0].split(",").map(fp)
                            });
                        }

                        grunt.file.write(grunt.config("config.path.release") + "meta/changelog.json", JSON.stringify(aLogData, 1, "\t"), { encoding: "UTF-8" });
                    });
			    },
			    stdout: false
			},

			dist: {
                cmd: 'mv <%= config.path.merged %>/* <%= config.path.release %>'
			}
        },

        qunit: {
            all: [ 'test/desktop/jindo.*.html', 'test/mobile/jindo.*.html' ],
            desktop: [ 'test/desktop/jindo.*.html' ],
            mobile: [ 'test/mobile/jindo.*.html' ]
        },

        jshint: {
			all : {
				src : [ 'src/**/*.js' ],
				options : {
				    jshintrc: true,
				    ignores : [ '**/flashObject.js' ]
                }
			}
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // quality practice tasks : lint and unit test
    grunt.registerTask('qp', [
        'jshint',
        'qunit:all'
    ]);

    // dist tasks : to make distribution merged files
    grunt.registerTask('dist', [
      'concat:polyfill',
      'concat:patch',
      'comment:desktop',
      'comment:mobile',
      'merge',
      'uglify:release',
      'banner',
      'clean:dist1',
      'exec:dist',
      'clean:dist2'
    ]);

    // default tasks
    grunt.registerTask('default', [
      'concat:polyfill',
      'concat:patch',
      'metafile:desktop',
      'metafile:mobile',
      'metafile:changelog',
      'comment:desktop',
      'comment:mobile',
      'auidoc',
      'auidoc_recheck',
      'merge',
      'uglify:release',
      'banner'
    ]);

    grunt.registerTask('merge', function() {
        var sVersion = grunt.config("pkg.version"),
            aReleaseFile = grunt.config("concat.options.list.release"),
            sDestPath = grunt.config("config.path.merged"),
            aData = [];

        ["ko", "en"].forEach(function(sLang) {
            aReleaseFile.forEach(function(v, i) {
                var aFileList = grunt.config("concat.options.list.all"),
                    sType = /desktop/.test(v) ? "desktop" : "mobile";

                // remove window.js on mobile version
                sType == "mobile" && aFileList.splice(aFileList.indexOf("window.js"), 1);

                // set files path
                aFileList.forEach(function(v, i, arr) {
                    arr[i] = grunt.config("config.path.release") + sType +"/"+ sLang +"/"+ v;
                });

                aData.push({
                    src: aFileList,
                    dest: sDestPath + sType +"/"+ sLang + "/"+ v +".tmp"
                });

            });
        });

        // set data to concatenate each object source files.
        grunt.config("concat.release.files", aData);
        grunt.task.run("concat:release");

        // set release info (version number, type, etc.)
        grunt.task.run("versioning:en");
        grunt.task.run("versioning:ko");
        grunt.task.run("clean:build");
    });

    grunt.registerTask('versioning', 'Set the version and merge namespace & nonconflict contents', function(sLang) {
        var aReleaseFile = grunt.config("concat.options.list.release"),
            sVersion = grunt.config("pkg.version");

        aReleaseFile.forEach(function(v, i) {
            var sType = /desktop/.test(v) ? "desktop" : "mobile",
                sReleasePath = grunt.config("config.path.release") + sType +"/"+ sLang +"/",
                sDestPath = grunt.config("config.path.merged") + sType +"/"+ sLang +"/"+ v,
                sContent = grunt.file.read(sDestPath +".tmp", { encoding: "UTF-8" }),
                sNamespace = grunt.config("pkg.build.namespace");

            // read the namespace.js and split content using '[[script-insert]]' delimiter.
            var aNamespace = grunt.file.read(sReleasePath +"namespace.js", { encoding: "UTF-8" }).split(/^\/\/[^\]]+\[\[script\-insert\]\][^>]+>$/m);

            // put 'namespace.js' split content to header and footer.
            sContent = [ aNamespace[0], sContent, aNamespace[1] ].join("\n");

            // if no namespace required release, read 'nonconflict.js' and append to the end.
            if(!/ns\.js/.test(v)) {
                sContent += "\n\n"+ grunt.file.read(sReleasePath +"noconflict.js" , { encoding: "UTF-8" });
            }

            // if the namespace is not 'jindo', then set for the given namespace.
            if(sNamespace != "jindo") {
                sContent = sContent.replace(/jindo/g, sNamespace);
            }

            // set the document api url
            sContent = sContent.replace(/@docurl@/g, grunt.config("config.docurl"));

            // set the version info
            sContent = sContent.replace(/@version@/g, sVersion).replace(/@type@/g, sType);

            grunt.file.write(sDestPath, sContent, { encoding: "UTF-8" });
        });
    });

    // http://wiki.nhncorp.com/pages/viewpage.action?pageId=262947536
    grunt.registerTask('metafile', 'Create meta files.', function(sType) {
        // changelog
        if(sType == "changelog" && grunt.config("pkg.build.changelog.create")) {
            grunt.task.run('exec:gitlog');

        // dependency
        } else if(/^(desktop|mobile)$/.test(sType)) {
            var options = this.options(),
                oMeta = {
                    getMetaKey : function(obj, val) {
                        val = val.trim();

                        for(var x in obj) {
                            if(obj[x][val]) {
                                return obj[x][val].key;
                            } else if(obj[x][val +".hidden"]) {
                                return obj[x][val +".hidden"].key;
                            }
                        }
                    },

                    createMetaFile : function(sType) {
                        var oFileList = {},
                            sSrcPath = grunt.config("config.path.source")[sType],
                            sDestPath = grunt.config("config.path.release") + "meta/"+ sType +".json",
                            aDependencyKey,
                            vTemp;

                        grunt.file.recurse(sSrcPath, function(abspath, rootdir, subdir, filename) {
                            if(!subdir && /\.js$/.test(filename)) {
                               filename.match(/([\w\.]+\.js)$/i);
                               sKey = RegExp.$1;

                               if(options.filekey[sKey]) {
                                   sPrefix = options.prefix[sType] + options.filekey[sKey];
                                   oFileList[sKey] = {};
                               }

                               var re = /\/\/\-!(.*?)\sstart(?:\((.*?)\))?!\-\/\/(?:.*?)\/\/\-!\1\send(?:\((.*?)\))?!-\/\//g,
                                   sContent = grunt.file.read(abspath, { encoding: "UTF-8" }),
                                   aMatch = sContent.toString().replace(/[\r\n]/g,"").match(re);

                               if(aMatch && aMatch.length) {
                                   for(var i=0, j=1, val; val = aMatch[i]; i++) {
                                       val.match(re);

                                       if(RegExp.$1 && oFileList[sKey]) {
                                           oFileList[sKey][RegExp.$1] = {
                                               key: sPrefix + j,
                                               dependency: typeof RegExp.$2 != "undefined" ? RegExp.$2 : ""
                                           };

                                           j++;
                                       }
                                   }
                               }
                            }
                        });

                        for(var x in oFileList) {
                           for(var z in oFileList[x]) {
                               aDependencyKey = [];
                               vTemp = oFileList[x][z].dependency;

                               if(typeof vTemp == "string") {
                                   vTemp = vTemp && vTemp.split(",");

                                   for(var i=0, val; val = vTemp[i]; i++) {
                                       aDependencyKey.push(oMeta.getMetaKey(oFileList, val));
                                   }
                               }
                               oFileList[x][z].dependency = aDependencyKey;
                           }
                        }

                        grunt.file.write(sDestPath, JSON.stringify(oFileList, 1, "\t"), { encoding: "UTF-8" });
                    }
                };

            oMeta.createMetaFile(sType);
        }
        grunt.log.oklns("Successfully created "+ sType +" meta file.");
    });

    grunt.registerTask('comment', 'Create i18n comments binded files.', function(sType) {
        var xml2js = require('xml2js'),
            parser = new xml2js.Parser();

        grunt.file.recurse(grunt.config("config.path.source.i18n"), function(abspath, rootdir, subdir, filename) {
            var sFileContent = grunt.file.read(abspath, { encoding: "UTF-8" });

            parser.parseString(sFileContent, function(err, result) {
                var sFileName = result.comments.$.name +".js",
                    sSrcPath = grunt.config("config.path.source")[sType] + sFileName,
                    sDestPath = grunt.config("config.path.release") + sType +"/"+ subdir +"/"+ sFileName,
                    sContent;

                if(grunt.file.exists(sSrcPath)) {
                    sContent = grunt.file.read(sSrcPath, { encoding: "UTF-8" });

                    if(result.comments.comment) {
                        for(var i=0, el; el = result.comments.comment[i]; i++) {
                            sContent = sContent.replace("{{"+ el.$.id +"}}", el._.replace(/^[\r?\n]*|[\r?\n?\s]*$/g, "").replace(/\${2}/g, function(m) { return "$$$" } ));
                       }
                    }

                    grunt.file.write(sDestPath, sContent, { encoding: "UTF-8" });
                }
            });
        });

        grunt.log.oklns("Successfully created "+ sType +" commented files.");
    });

    grunt.registerTask('auidoc', 'Create API documentation files.', function() {
        var sVersion = grunt.config("pkg.version"),
            bBuildDoc = grunt.config("pkg.build.auidoc.create");

        if(bBuildDoc && sVersion) {
            grunt.file.recurse("build/api/config", function(abspath, rootdir, subdir, filename) {
                // change version on doc
                var oConfig = grunt.file.readJSON(abspath, { encoding: "UTF-8" });
                oConfig.version = sVersion;
                grunt.file.write(abspath, JSON.stringify(oConfig, 1, "\t"), { encoding: "UTF-8" });

                filename.match(/(\w+)\.json$/i);
                grunt.task.run('exec:auidoc:'+ [ subdir, RegExp.$1 ].join(":"));
            });
        }
    });

    grunt.registerTask('auidoc_recheck', function() {
        if(grunt.config("pkg.build.auidoc.create")) {
            var aPath = [];

            grunt.file.recurse(grunt.config("config.path.release") +"doc", function(abspath, rootdir, subdir, filename) {
                if(subdir.indexOf("classes") > -1 && aPath.indexOf(subdir) == -1) {
                    aPath.push(subdir);
                };
            });

            // If not created API doc properly, run auidoc task again
            if(aPath.length < 4) {
                 grunt.task.run('auidoc');
            }
        }
    });

    grunt.registerTask('banner', 'Put banner on release files', function() {
        grunt.file.recurse(grunt.config("config.path.merged"), function(abspath, rootdir, subdir, filename) {
            var sBanner = grunt.config("meta.banner").replace("{{type}}", subdir.replace(/\/.*$/,"")),
                sContent = grunt.file.read(abspath, { encoding: "UTF-8" });

            if(sContent.indexOf("/**") != 0) {
                grunt.file.write(abspath, sBanner + sContent, { encoding: "UTF-8" });
            }
        });
    });

    grunt.registerTask('cleanup', '', function() {
        //grunt.file.copy(grunt.config("config.path.merged"), grunt.config("config.path.release"));
        grunt.task.run("clean:dist");
    });
};
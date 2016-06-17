"use strict";

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		//Check js files:
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			}, 
			all: {
				src: [
					"Gruntfile.js", 
					"app/*.js",
					"app/**/*.js",
					"assets/js/*.js",
					"assets/js/**/*.js"
				]
			}
		}, 
		jscs: {
			all: {
		        options: {
		            config: ".jscsrc",
			        fix: true
		        },
		        files: {
		            src: ["<%= jshint.all.src %>"]
		        }
		    }
		},
		//Insert bower components:
		wiredep: {
			bowerDependencies: { // add other dependencies
				src : ["index.html"],
				options: {
					// ignorePath : "../../public"
					// exclude: "jquery"
				}
			}
		}, 
		//Insert own scripts and css files:
		injector: {
			/*DEV injections*/
		    devHead: {
			  	options: {
			   		addRootSlash : false,
			   		starttag: "<!-- injector-head:{{ext}} -->",
				},
			    files: {
			      "index.html": ["assets/js/head/*.js", "assets/css/*.css"],
			    }
		    }, 
		    devBody: {
			  	options: {
			   		addRootSlash : false,
			   		starttag: "<!-- injector-body:{{ext}} -->", 

				},
			    files: {
			      "index.html": ["assets/js/body/*.js"],
			    }
		    }, 
		    devAngular: {
			  	options: {
			   		addRootSlash : false,
			   		starttag: "<!-- injector-angular:{{ext}} -->", 

				},
			    files: {
			      "index.html": [ //use array to set order of injection
			      	["app/app.js", "app/*.js"], 
			      	["app/**/*.js", "app/**/**/*.js"]
			      ]
			    }
		    }, 
		    /*DIST injections*/
		    distHead: {
			  	options: {
			   		addRootSlash : false,
			   		ignorePath: "dist",
			   		starttag: "<!-- injector-head:{{ext}} -->"
				},
			    files: {
			      "dist/index.html": ["dist/assets/js/head/*.js", "dist/assets/css/*.css"],
			    }
		    }, 
		    distBody: {
			  	options: {
			   		addRootSlash : false,
			   		ignorePath: "dist",
			   		starttag: "<!-- injector-body:{{ext}} -->"
				},
			    files: {
			      "dist/index.html": ["dist/assets/js/body/*.js"],
			    }
		    }, 
		    distAngular: {
			  	options: {
			   		addRootSlash : false,
			   		ignorePath: "dist",
			   		starttag: "<!-- injector-angular:{{ext}} -->", 

				},
			    files: {
			      "dist/index.html": ["dist/app/*.js"]
			    }
		    }
		}, 
		//Compile sass:
		sass: {
		    dev: {
		      	options: { 
		        	noCache: true,
		        	sourcemap: "none"
		      	},
		      	files: {
		        	"assets/css/custom.css": "assets/sass/main.scss"
		      	}
		    }
		},
		//Add vendor prefixes to css files:
		autoprefixer: {
			options: {
				browsers: "last 3 versions", 
				remove: false
			},
			customCss: {
				src: "assets/css/custom.css", 
				dest: "assets/css/custom.css" 
			}
		}, 
		watch: {
			bower: {
		        files: ["bower.json"],
		        tasks: ["wiredep"]
		    },
			js: {
				files: ["<%= jshint.all.src %>"],
		      	tasks: ["jshint", "injector:devHead", "injector:devBody", "injector:devAngular"]
			}, 
			sass: {
				files: ["assets/sass/*.scss"],
		      	tasks: ["sass"]
			}, 
		    css: {
		    	files: ["assets/css/*.css"],
		    	tasks: ["injector:devHead"]
		    }
	    }, 
	    concat: {
		    app: {
			    options: {
			    	banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
			        separator: "\n;\n"
			    },
		    	src: ["app/app.js", "app/*.js", "app/**/*.js"],
		    	dest: "tmp/app/app.js"
		    },
		    customHead: {
		    	options: {
			    	banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
			        separator: "\n;\n"
			    },
		    	src: ["assets/js/head/*.js"],
		    	dest: "tmp/assets/js/head/custom.head.js"
		    },
		    customBody: {
		    	options: {
			    	banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
			        separator: '\n;\n'
			    },
		    	src: ["assets/js/body/*.js"],
		    	dest: "tmp/assets/js/body/custom.body.js"
		    }, 
		    customCss: {
		    	options: {
			    	banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
			        separator: "\n\/*separator*\/\n"
			    },
		    	src: ["assets/css/*.css", "!assets/css/custom.css", "assets/css/custom.css"],
		    	dest: "tmp/assets/css/custom.css"
		    }
		}, 
		uglify: {
			app: {
				files: {
					"tmp/app/app.min.js": ["tmp/app/app.js"]
				}
			}, 
			head: {
				files: {
					"tmp/assets/js/head/custom.head.min.js": ["tmp/assets/js/head/custom.head.js"]
				}
			}, 
			body: {
				files: {
					"tmp/assets/js/body/custom.body.min.js": ["tmp/assets/js/body/custom.body.js"]
				}
			}
		}, 
		cssmin: {
			allCss: {
				files: {
					"tmp/assets/css/custom.min.css": ["tmp/assets/css/custom.css"]
				}
			}
		}, 
		copy: {
			dist: {
				files: [
					{
					    expand: true,
					    src: ["index.html", "php/**/*"],
					    dest: "dist/",
					},
					{
						expand: true,
					    cwd: "tmp/",
					    src: [
					    	"app/*.min.js", 
					    	"assets/css/*.min.css", 
					    	"assets/js/body/*.min.js",
					    	"assets/js/head/*.min.js"
					    ],
					    dest: "dist/"
					},
					{
					    expand: true,
					    cwd: "assets/",
					    src: ["*/**", "!css/**", "!js/**", "!sass/**"],
					    dest: "dist/assets/"
					}
				]
			}

		}, 
		ngtemplates: {
		    dist: {
		        options: {
		            module: "app",
		            htmlmin: {
						collapseWhitespace: true,
						conservativeCollapse: true,
						removeComments: true, // Only if you don't use comment directives!
					}
		        },
		        src: ["app/**/*.html"],
		        dest: "app/templateCache.js"
		    }
		}, 
		ngAnnotate: {
		    app: {
		        files: [{
		    	    expand: true,
		        	cwd: "tmp/app",
		          	src: ["app.js"],
		          	dest: "tmp/app"
		        }]
		    }
		}, 
		clean: {
			tmp: ["tmp/*"]
		}

	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jscs");
	grunt.loadNpmTasks("grunt-wiredep");
	grunt.loadNpmTasks("grunt-injector");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-angular-templates");
	grunt.loadNpmTasks("grunt-ng-annotate");
	grunt.loadNpmTasks("grunt-contrib-clean");

	grunt.registerTask("hint", ["jshint", "jscs"]);
	grunt.registerTask("makeugly", ["uglify", "cssmin"]);
	grunt.registerTask("dist", [
		"jshint", 
		"jscs",
		"sass", 
		"autoprefixer",
		"ngtemplates",
		"wiredep",
		"concat",
		"ngAnnotate", 
		"uglify",
		"cssmin", 
		"copy",
		"injector:distHead", 
		"injector:distBody", 
		"injector:distAngular",
		"clean"
	]);
	grunt.registerTask("default", [
		"jshint", 
		"jscs",
		"sass", 
		"autoprefixer",
		"ngtemplates",
		"wiredep", 
		"injector:devHead", 
		"injector:devBody", 
		"injector:devAngular",
		"watch" 
	]);

};

#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT     ?= 8080

SCRIPTS   = $(shell find . -type f -name '*.js' -not -path "*build*")

DOMAIN    = ysdn-admin.surge.sh
REPO      = ysdn-2016/admin
BRANCH    = $(shell git rev-parse --abbrev-ref HEAD)

#
# Tasks
#

build: install build-js build-css build-assets

build-js: build/bundle.js
build-css: build/styles.css
build-assets: build/favicon.png build/index.html build/assets
	@cp build/index.html build/200.html


watch: install
	@$(BIN)/budo index.js:bundle.js \
		--port $(PORT) \
		--live -- -t vueify -t [ babelify --presets es2015 ] | $(BIN)/garnish

deploy: build
	@echo "Deploying branch \033[0;33m$(BRANCH)\033[0m to Github pages..."
	@make clean
	@NODE_ENV=production make build
	@(cd build && \
		git init -q . && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "\033[0;90m" && \
		git push "git@github.com:$(REPO).git" HEAD:gh-pages --force && \
		echo "\033[0m")
	@make clean
	@echo "Deployed to \033[0;32mhttp://ysdn-2016.github.io/admin/\033[0m"

clean:
	@rm -rf build
clean-deps:
	@rm -rf node_modules

#
# Shorthands
#

install: node_modules

#
# Targets
#

node_modules: package.json
	@npm install

build/%: %
	@mkdir -p $(@D)
	@cp -r $< $@

build/bundle.js: $(SCRIPTS)
	@mkdir -p build/
	@$(BIN)/browserify index.js -t vueify -t [ babelify --presets es2015 ] -o $@
	@if [[ "$(NODE_ENV)" == "production" ]]; then uglifyjs $@ -o $@; fi

build/styles.css:
	@mkdir -p build/
	@cp styles.css build/styles.css

#
# Phony
#

.PHONY: develop clean clean-deps

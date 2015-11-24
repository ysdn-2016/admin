
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT     ?= 8080

DOMAIN    = ysdn-admin.surge.sh
REPO      = ysdn-2016/admin
BRANCH    = $(shell git rev-parse --abbrev-ref HEAD)
CHANGES   = $(shell git diff --exit-code --quiet HEAD; echo $$?)

#
# Tasks
#

build: install build-js build-css build-assets

build-js:
	@mkdir -p build/
	@$(BIN)/browserify index.js -t vueify -t [ babelify --presets es2015 ] -o build/bundle.js
build-css:
	@mkdir -p build/
	@cp styles.css build/styles.css
build-assets: build/favicon.png build/index.html build/assets
	@cp build/index.html build/200.html


watch: install
	@$(BIN)/budo index.js:bundle.js \
		--port $(PORT) \
		--live -- -t vueify -t [ babelify --presets es2015 ] | $(BIN)/garnish

deploy: build
	@surge -p build -d $(DOMAIN)

# @if [[ $(CHANGES) -ne 0 ]]; then echo "\033[0;31mError:\033[0m You have uncommitted changes. Please commit changes before deploying." && exit 1; fi
# @echo "Deploying branch \033[0;33m$(BRANCH)\033[0m to Github pages..."
# @make clean
# @NODE_ENV=production make build
# @(cd build && \
# 	git init -q . && \
# 	git add . && \
# 	git commit -q -m "Deployment (auto-commit)" && \
# 	echo "\033[0;90m" && \
# 	git push "git@github.com:$(REPO).git" HEAD:gh-pages --force && \
# 	echo "\033[0m")
# @make clean
# @echo "Deployed to \033[0;32mhttp://ysdn-2016.github.io/admin/\033[0m"

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

#
# Phony
#

.PHONY: develop clean clean-deps

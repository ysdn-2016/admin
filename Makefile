
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT     ?= 8080

SCRIPTS   = $(shell find . -type f -name '*.js' -not -path "*build*")

BROWSERIFY_ARGS = -t vueify -t [ babelify --presets es2015-loose ] -t envify

DOMAIN    = ysdn-admin.surge.sh
REPO      = ysdn-2016/admin
BRANCH    = $(shell git rev-parse --abbrev-ref HEAD)

#
# Tasks
#

build: install build-css build-assets build-js

build-js: build/bundle.js
build-css: build/styles.css
build-assets: build/favicon.png build/index.html build/assets
	@cp build/index.html build/404.html

watch: install
	@$(BIN)/budo index.js:bundle.js \
		--port $(PORT) \
		--live \
		--css styles.css \
		--pushstate -- $(BROWSERIFY_ARGS)

deploy:
	@echo "Building site for \033[0;33mproduction\033[0m environment..."
	@make clean
	@NODE_ENV=production make build
	@echo "Deploying branch \033[0;33m$(BRANCH)\033[0m to Github pages..."
	@(cd build && \
		git init -q . && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "\033[0;90m" && \
		git push "git@github.com:$(REPO).git" HEAD:gh-pages --force && \
		echo "\033[0m")
	@make clean
	@echo "Deployed to \033[0;32mhttp://ysdn2016.com/admin/\033[0m"

ssh:
	@ssh root@159.203.25.109

db\:connect:
	@ssh -tt root@159.203.25.109 'dokku mongo:connect gradshow'

lint:
	@xo

test: lint

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

build/index.html: index.html
	@sed \
		-e "s/\/bundle.js/\/admin\/bundle.js?`date +%s`/" \
		-e "s/\/styles.css/\/admin\/styles.css?`date +%s`/" \
		-e "s/\/favicon.png/\/admin\/favicon.png/" $< > $@

build/bundle.js: $(SCRIPTS)
	@mkdir -p build/
	@$(BIN)/browserify index.js $(BROWSERIFY_ARGS) -o $@
	@if [[ "$(NODE_ENV)" == "production" ]]; then $(BIN)/uglifyjs $@ -o $@; fi

build/styles.css:
	@mkdir -p build/
	@cp styles.css build/styles.css

#
# Phony
#

.PHONY: develop clean clean-deps

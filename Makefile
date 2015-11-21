
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT = 8080

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


watch: install
	@$(BIN)/budo source/index.js:assets/bundle.js \
		--port $(PORT) \
		--dir source \
		--live -- -t vueify -t [ babelify --presets es2015 ] | $(BIN)/garnish

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

.PHONY: install test

TESTS := $(shell find ./src -name "test.js")

install:
	@ # Install the app
	@echo "Installing phantom bootstrapper"
	@npm install
	@rm -rf ./bin
	@mkdir ./bin
	@cp templates/server.tmpl bin/server
	@cp templates/consumer.tmpl bin/consumer
	@chmod a+x bin/server
	@chmod a+x bin/consumer

test:
	@ # Run some mocha tests
	@./node_modules/.bin/mocha $(TESTS)

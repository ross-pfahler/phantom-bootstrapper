.PHONY: install test deploy

TESTS := $(shell find ./src -name "test.js")

install:
	@ # Install the app
	@echo "Installing phantom bootstrapper"
	@npm install

test:
	@ # Run some mocha tests
	@./node_modules/.bin/mocha $(TESTS)

deploy:
	@echo "Deploying heroku master"
	@git push heroku master
	@heroku config:set NODE_ENV=production

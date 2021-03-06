.PHONY: install test deploy run

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
	@heroku maintenance:on
	@git push heroku master
	@heroku maintenance:off
	@heroku config:set NODE_ENV=production

run:
	@echo "Running locally via foreman"
	@node_modules/.bin/nf start

spam:
	@echo "Mmmmm spam"
	@node src/test/spammer.js

buildboxes:
	@heroku addons:add redistogo
	@heroku ps:scale web=1 worker=1

removeboxes:
	@heroku addons:remove redistogo
	@heroku ps:scale web=0 worker=0

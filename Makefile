gen:
	cp ../backend/graphql/graph/schema/* ./src/graphql/
	npm run graphql-codegen --config ./src/graphql/codegen-server.yaml

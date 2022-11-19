gen:
	cp ../backend/graphql/graph/schema/* ./src/graphql/schema/
	npm run codegen

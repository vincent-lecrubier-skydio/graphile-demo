# graphile demo


```
curl http://localhost:5678/openapi.json > openapi.json && \
npx @openapitools/openapi-generator-cli generate -i openapi.json -g typescript-fetch -o ./sdk-typescript/
```

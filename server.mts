import preset from "./graphile.config.mjs";
import { postgraphile } from "postgraphile";

// Our PostGraphile instance:
export const pgl = postgraphile(preset);

import { createServer } from "node:http";
import express from "express";
import { grafserv } from "grafserv/express/v4";
import { hookArgs, execute } from "postgraphile/grafast";
// import { grafast } from "grafast";
// @ts-ignore
import { useSofa } from "sofa-api";
import bodyParser from "body-parser";
import { print } from "graphql";

const main = async () => {

  // Create express server
  const app = express();
  const server = createServer(app);
  server.on("error", () => { });

  // Add postgraphile to server
  const { schema, resolvedPreset } = await pgl.getSchemaResult();
  const serv = pgl.createServ(grafserv);
  serv.addTo(app, server).catch((e) => {
    console.error(e);
    process.exit(1);
  });

  // Add sofa on top of the postgraphile schema
  app.use(bodyParser.json());
  app.use('/', useSofa({
    schema: schema,
    basePath: '/',
    openAPI: {
      info: {
        title: 'Skydio External API',
        version: '3.0.0',
      },
      endpoint: '/openapi.json',
      tags: [
        {
          name: 'Missions',
          description: 'Mission management',
        }
      ],
      // paths: {
      //   '/mission-spec': { tags: ['Missions'] }
      // }
    },
    swaggerUI: {
      path: '/docs',
    },
    routes: {
      // 'Query.missionSpec': {
      //   method: 'POST',
      //   // path: '/book/:id',
      //   // tags: ['Missions'],
      // }
    },
    customScalars: {
      "UUID": { type: 'string', format: 'uuid' }
    },
    async execute(args: any) {
      // We could validate the query here, but since it comes from sofa, we trust it.
      // See https://postgraphile.org/postgraphile/next/usage-schema
      const grafastArgs = await hookArgs(
        args,
        resolvedPreset,
        { node: args.contextValue }
      );
      // Execute the request using Grafast:
      return await execute(grafastArgs, resolvedPreset);
    },
  }));

  // Start server
  server.listen(5678);

  console.log("Server listening at http://localhost:5678");

}

main();
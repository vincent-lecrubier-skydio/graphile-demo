import { makeJSONPgSmartTagsPlugin } from "postgraphile/utils";

// See https://postgraphile.org/postgraphile/next/behavior

/** @satisfies {GraphileConfig.Plugin} */
export const SkydioSmartTagsPlugin = makeJSONPgSmartTagsPlugin(
  {
    version: 1,
    config: {
      class: {
        mission_template: {
          description: "A mission, supporting versioning",
          tags: {
            // name: "missionSpecification",
            behavior: "+resource:select +resource:single +resource:list -type:node"
          },
          attribute: {
            uuid: {
              description: "Unique identifier",
              tags: {
                // name: "automaticStart",
                behavior: "+select",
              },
            },
          },
          constraint: {
            mission_template_organization_id_name_key: {
              tags: {
                name: "missionTemplateByName",
                behavior: "-select -list -query:resource:single",
              },
            },
          },
        },
        mission_spec: {
          description: "A precise specification for a mission",
          tags: {
            // name: "missionSpecification",
            behavior: "+resource:select +resource:single +resource:list -type:node"
          },
          attribute: {
            uuid: {
              description: "Unique identifier",
              tags: {
                // name: "automaticStart",
                behavior: "+select",
              },
            },
            auto_start: {
              description: "Should the mission start automatically if `true` then ~~yes~~",
              tags: {
                // name: "automaticStart",
                behavior: "+select",
              },
            },
            template_uuid: {
              description: "UUID of the template for this mission",
              tags: {
                // name: "automaticStart",
                behavior: "-select",
              },
            },
          },
          constraint: {
            fk_mission_template_uuid: {
              description: "The template to use for this mission",
              tags: {
                behavior: "-select",
                foreignFieldName: "specs",
                fieldName: "template"
              },
            }
          }
        },
      },
      attribute: {},
      constraint: {},
      procedure: {},
    }
  }
);

/** @satisfies {GraphileConfig.Preset} */
export const SkydioPreset = {
  schema: {
    defaultBehavior: [
      "-select -list -connection -single -order -orderBy -filter -filterBy -type:node -interface:node",
      "-query:resource:connection -query:interface:connection -queryField:resource:connection -typeField:resource:connection",
      "-resource:select -resource:list -resource:connection -resource:insert -resource:update -resource:delete",
      "-attribute:select -attribute:insert -attribute:update -attribute:base -attribute:orderBy -attribute:filter -attribute:filterBy -condition:attribute:filterBy"
    ].join(" ")
  },
  plugins: [SkydioSmartTagsPlugin]
};
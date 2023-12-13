import { DefaultApi } from "./sdk-typescript";

const api = new DefaultApi();
const missionSpec = await api.missionSpecGet({ uuid: "" });
missionSpec.autoStart;

const missionSpecs = await api.missionSpecsListGet({ first: 10 });

missionSpecs[0].autoStart;


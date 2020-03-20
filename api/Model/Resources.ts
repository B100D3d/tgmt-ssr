import resourceModel from "./MongoModels/resourceModel";
import { Res, ResourceModel } from "../types";

export const getResources = async (): Promise<Array<Res>> => {
    const dbRes: ResourceModel[] = await resourceModel.find().exec();

    const resources = dbRes.map(({img, text, url}: Res) => ({img, text, url}));

    return resources;
};
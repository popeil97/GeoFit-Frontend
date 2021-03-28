import { CheckpointMapData } from './checkpointModels';
import { UserData } from './userModels';

interface PinSettings {
    followerPinsOnly: boolean;
    malePinsOn: boolean;
    femalePinsOn: boolean;
    allAgesOn: boolean;
    minAge: number;
    maxAge: number;
    showOrgPins: boolean;
}
interface RoutePins {
    title: string;
    desciption: string;
    lon: number;
    lat: number;
    image_urls: string[];
}
interface RouteData {
    name: string;
    coords: any;
    route_pins: RoutePins[];
    userData: UserData[];
    org_pins: UserData[];
    checkpoints: CheckpointMapData[];
}
interface OrgPinData {
    org_pins: UserData[];
}

interface MapBoxPlaceResp {
    features: any[];
}
interface MapBoxPlace {
    center:any;
    place_name:string;
}
interface MapBoxCoord {
    lon:number;
    lat:number;
}
interface GraphHopperResp {
    coords:any[];
    distance:number;
    dist_unit:string;
}

export {
    PinSettings,
    RoutePins,
    RouteData,
    OrgPinData,
    MapBoxPlaceResp,
    MapBoxPlace,
    MapBoxCoord,
    GraphHopperResp,
}
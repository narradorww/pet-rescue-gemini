import { AckType } from '../../api/model/enum/ack-type';
export declare class callbackWile {
    obj: Object;
    constructor();
    addObjects(ids: AckType | String, serializeds: string): boolean;
    getObjKey(serialized: string): string | false;
    checkObj(id: AckType | String, serialized: string): boolean;
    get module(): Object;
}

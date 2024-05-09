import { onMode } from '../model/enum';
/**
 * attribution and behavior change of a given event
 */
export declare class CallbackOnStatus {
    statusFind: any;
    constructor();
    /**
     * waiting for event change
     * @param event returns event status
     */
    onChange(event: (status: any) => void): Promise<void>;
    /**
     * here you can monitor user events
     * @param type types of monitoring
     * @param callback returns of monitoring
     */
    on(type: onMode, callback: (state: any) => void): Promise<void>;
}

import { Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
export declare function checkingCloses(browser: Browser | string, mergedOptions: CreateConfig, callStatus: (e: string) => void): Promise<void>;

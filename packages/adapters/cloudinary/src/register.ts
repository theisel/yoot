import {registerAdapters} from '@yoot/yoot';
import {adapter} from './core/adapter.ts';
/**
 * Automatic adapter registration for the Cloudinary adapter.
 * @packageDocumentation
 */
export {};

registerAdapters(adapter);

import { RESEND_API_KEY } from '../configs/envConfig.js';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

export { resend };

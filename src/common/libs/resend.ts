import { EnvConfiguration } from '../configs/env.config';
import { Resend } from 'resend';

const resend = new Resend(EnvConfiguration().resendApiKey);

export { resend };

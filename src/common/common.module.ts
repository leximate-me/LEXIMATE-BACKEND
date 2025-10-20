import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { HashAdapter } from './interfaces/hash.interface';

@Module({
  providers: [
    {
      provide: 'HashAdapter',
      useClass: BcryptAdapter,
    },
  ],
  exports: ['HashAdapter'],
})
export class CommonModule {}

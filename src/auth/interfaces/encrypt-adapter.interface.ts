export interface EncryptAdapter {
  hashSync(data: string | Buffer, saltOrRounds: string | number): string;
}

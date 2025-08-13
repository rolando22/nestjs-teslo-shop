export interface EncryptAdapter {
  hashSync(data: string | Buffer, saltOrRounds: string | number): string;
  compareSync(data: string | Buffer, encrypted: string): boolean;
}

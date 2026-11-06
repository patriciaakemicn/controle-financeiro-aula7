import { Schema, HydratedDocument } from 'mongoose';

export interface Transacao {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  consumoConsciente: boolean;
}
export type TransacaoDocument = HydratedDocument<Transacao>;

export const TransacaoSchema = new Schema<Transacao>({
  descricao: { type: String, required: true, trim: true },
  valor: { type: Number, required: true, min: 0.01 },
  tipo: { type: String, required: true, enum: ['receita', 'despesa'] },
  categoria: { type: String, required: true, trim: true },
  consumoConsciente: { type: Boolean, required: true },
}, { versionKey: false });

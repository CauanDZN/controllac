import {NavigatorScreenParams} from '@react-navigation/native';

export type AppTabParamList = {
  Lotes: undefined;
  Produtos: undefined;
  Scanner: undefined;
  Cadastrar: undefined;
  Resumo: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList> | undefined;
  LoteForm: {batchId?: string; productId?: string} | undefined;
  ProdutoForm:
    {productId?: string; barcode?: string; chainToLote?: boolean} | undefined;
};

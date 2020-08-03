import { UserModel, TokenInfo } from "./index"

declare global {
  namespace Express{
    export interface Request {
      uniqueId: TokenInfo;
      user: UserModel;
      testAccount: boolean;
    }
  }
}
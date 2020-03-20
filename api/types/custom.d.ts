import { TokenInfo } from "./index";

declare global {
  namespace Express{
    export interface Request {
      user: TokenInfo;
    }
  }
}
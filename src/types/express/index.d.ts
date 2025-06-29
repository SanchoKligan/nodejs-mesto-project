/* eslint-disable no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';

declare global {
   namespace Express {
      export interface Request {
         user: JwtPayload
      }
   }
}

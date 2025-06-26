/* eslint-disable no-unused-vars */

declare namespace Express {
   export interface Request {
      user?: {
        _id: string,
      }
   }
}

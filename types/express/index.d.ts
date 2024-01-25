import express from "express";

interface UserData {
  User: string,
  Groups: Group[]
}
declare global {
  namespace Express {
    interface Request {
      sessionData?: UserData,
      files: any
    }
  }
}
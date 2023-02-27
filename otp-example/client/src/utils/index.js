import axios from 'axios';

export const isFalse = (val) => {
  return !val;
};

export const delay = (sec = 2000) => {
  return new Promise((res) => setTimeout(res, sec));
};

export class CodeError extends Error {
  constructor(message, code) {
   super(message);
   this.code = code;
  }
}

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});
